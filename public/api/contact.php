<?php
/**
 * SpaceCraft Interiors — enquiry form endpoint (POST /api/contact.php).
 *
 * Deployed with the static site into public_html/api/. All secrets live in a config file
 * OUTSIDE public_html (see deploy/contact-config.example.php and docs/DEPLOYMENT-HOSTINGER.md).
 *
 * Protection layers, in order:
 *   method + size limits → origin check → honeypot / time trap → rate limit
 *   → optional Cloudflare Turnstile → server-side validation → send via SMTP (or mail()).
 *
 * Responses are JSON: { "ok": true } or { "ok": false, "error": "…", "fields"?: { field: message } }.
 * Requires PHP 7.4+.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

const MAX_BODY_BYTES = 20000;

const PROJECT_TYPES = [
    'office' => 'Office interior',
    'corporate' => 'Corporate office',
    'retail' => 'Retail shop',
    'showroom' => 'Showroom',
    'restaurant' => 'Café / restaurant',
    'commercial' => 'Commercial space / renovation',
    'other' => 'Something else',
];
// Must match lib/validation.ts exactly.
const AREA_RANGES = ['Under 500 sq ft', '500 – 1,500 sq ft', '1,500 – 3,000 sq ft', '3,000 – 6,000 sq ft', '6,000+ sq ft', 'Not sure yet'];
const BUDGET_RANGES = ['Under ₹5 lakh', '₹5 – 15 lakh', '₹15 – 30 lakh', '₹30 – 60 lakh', '₹60 lakh +', 'Not decided yet'];
const FIELD_LABELS = [
    'name' => 'Full name',
    'company' => 'Company name',
    'phone' => 'Phone number',
    'email' => 'Email address',
    'projectType' => 'Project type',
    'location' => 'Project location',
    'area' => 'Approximate area',
    'budget' => 'Estimated budget',
    'message' => 'Project description',
];

const GENERIC_ERROR = "We couldn't send your enquiry just now.";

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail_server(string $logMessage): void
{
    // Logged for the site owner; never shown to the visitor. Contains no enquiry data.
    error_log('[spacecraft-contact] ' . $logMessage);
    respond(500, ['ok' => false, 'error' => GENERIC_ERROR]);
}

/* ------------------------------------------------------------------ config */

function load_config(): array
{
    $candidates = array_filter([
        getenv('SPACECRAFT_CONTACT_CONFIG') ?: null,
        // public_html/api/contact.php → two levels up is the folder that contains public_html
        dirname(__DIR__, 2) . '/spacecraft-private/contact-config.php',
    ]);
    foreach ($candidates as $path) {
        if (is_file($path)) {
            $config = require $path;
            if (is_array($config)) {
                return $config;
            }
        }
    }
    fail_server('Config file not found. Expected ' . dirname(__DIR__, 2) . '/spacecraft-private/contact-config.php');
    return [];
}

/* ------------------------------------------------------------------ guards */

function request_origin_host(): ?string
{
    $source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
    $host = $source !== '' ? parse_url($source, PHP_URL_HOST) : null;
    return is_string($host) ? strtolower($host) : null;
}

function client_ip(array $config): string
{
    if (!empty($config['trust_cloudflare_ip']) && !empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/**
 * Sliding-window limit per visitor. Stores only a keyed hash of the IP, never the IP itself.
 * Returns false when the visitor is over the limit.
 */
function rate_limit_ok(array $config, string $ip): bool
{
    $max = (int) ($config['rate_limit']['max'] ?? 5);
    $window = (int) ($config['rate_limit']['window_seconds'] ?? 3600);
    $dir = rtrim((string) ($config['storage_dir'] ?? ''), '/\\');
    if ($dir === '' || $max <= 0) {
        return true;
    }
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        error_log('[spacecraft-contact] Rate-limit storage not writable; limit skipped.');
        return true;
    }

    $key = hash_hmac('sha256', $ip, (string) ($config['hash_secret'] ?? 'spacecraft'));
    $file = $dir . '/rl-' . substr($key, 0, 40) . '.json';
    $now = time();

    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return true;
    }
    flock($fp, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fp), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], function ($t) use ($now, $window) {
        return is_int($t) && $t > $now - $window;
    }));
    $allowed = count($hits) < $max;
    if ($allowed) {
        $hits[] = $now;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($hits));
    flock($fp, LOCK_UN);
    fclose($fp);

    // Occasionally clear out stale files.
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/rl-*.json') ?: [] as $old) {
            if (filemtime($old) < $now - 2 * $window) {
                @unlink($old);
            }
        }
    }
    return $allowed;
}

function http_post_form(string $url, array $fields): ?string
{
    $body = http_build_query($fields);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return is_string($res) ? $res : null;
    }
    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $body,
        'timeout' => 10,
    ]]);
    $res = @file_get_contents($url, false, $ctx);
    return is_string($res) ? $res : null;
}

function turnstile_ok(string $secret, string $token, string $ip): bool
{
    if ($token === '' || strlen($token) > 2048) {
        return false;
    }
    $res = http_post_form('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ]);
    $json = $res ? json_decode($res, true) : null;
    return is_array($json) && !empty($json['success']);
}

/* -------------------------------------------------------------- validation */

function clean(string $value): string
{
    // Normalise whitespace and strip control characters (keeps newlines for the message field).
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n\t]/u', '', $value) ?? '';
    return trim($value);
}

function str_len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : (int) preg_match_all('/./us', $s);
}

function valid_phone(string $raw): bool
{
    $v = preg_replace('/[\s\-().]/', '', $raw) ?? '';
    return (bool) (preg_match('/^(?:\+?91|0)?[6-9]\d{9}$/', $v)
        || preg_match('/^0\d{9,10}$/', $v)
        || preg_match('/^\+(?!91)[1-9]\d{7,14}$/', $v)); // +91 numbers must match the Indian rules above
}

/** Mirrors lib/validation.ts. Returns [field => message]. */
function validate(array $d): array
{
    $e = [];
    foreach ($d as $field => $v) {
        $max = $field === 'message' ? 2000 : 200;
        if (str_len($v) > $max) {
            $e[$field] = $field === 'message' ? 'Please keep the description under 2,000 characters.' : 'Please keep this under 200 characters.';
        }
    }
    if (!isset($e['name'])) {
        if ($d['name'] === '') $e['name'] = 'Please enter your name.';
        elseif (str_len($d['name']) < 2) $e['name'] = 'Your name looks too short.';
    }
    if (!isset($e['phone'])) {
        if ($d['phone'] === '') $e['phone'] = 'Please enter a phone number so we can call you back.';
        elseif (!valid_phone($d['phone'])) $e['phone'] = 'Please enter a valid phone number.';
    }
    if (!isset($e['email'])) {
        if ($d['email'] === '') $e['email'] = 'Please enter your email address.';
        elseif (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $e['email'] = 'Please enter a valid email address.';
    }
    if (!array_key_exists($d['projectType'], PROJECT_TYPES)) $e['projectType'] = 'Please choose the type of project.';
    if (!isset($e['location']) && $d['location'] === '') $e['location'] = 'Please tell us where the space is.';
    if ($d['area'] !== '' && !in_array($d['area'], AREA_RANGES, true)) $e['area'] = 'Please choose an area range from the list.';
    if ($d['budget'] !== '' && !in_array($d['budget'], BUDGET_RANGES, true)) $e['budget'] = 'Please choose a budget range from the list.';
    if (!isset($e['message'])) {
        if ($d['message'] === '') $e['message'] = 'Please tell us a little about your project.';
        elseif (str_len($d['message']) < 20) $e['message'] = 'A few more details would help — at least 20 characters.';
    }
    return $e;
}

/* ----------------------------------------------------------------- mailing */

function header_safe(string $s): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $s));
}

function encode_header(string $s): string
{
    return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

function format_address(string $email, string $name = ''): string
{
    $name = header_safe($name);
    if ($name === '') {
        return '<' . $email . '>';
    }
    $display = preg_match('/[^\x20-\x7E]/', $name) ? encode_header($name) : '"' . addcslashes($name, '"\\') . '"';
    return $display . ' <' . $email . '>';
}

function build_body(array $d): string
{
    $lines = ['New enquiry from the SpaceCraft Interiors website', str_repeat('=', 50), ''];
    foreach (FIELD_LABELS as $field => $label) {
        if ($field === 'message') continue;
        $value = $field === 'projectType' ? PROJECT_TYPES[$d[$field]] : $d[$field];
        $lines[] = str_pad($label . ':', 22) . ($value !== '' ? $value : '—');
    }
    $lines[] = '';
    $lines[] = 'Project description:';
    $lines[] = $d['message'];
    $lines[] = '';
    $lines[] = str_repeat('-', 50);
    $tz = new DateTimeZone('Asia/Kolkata');
    $lines[] = 'Received: ' . (new DateTimeImmutable('now', $tz))->format('j M Y, g:i a') . ' IST';
    $lines[] = 'Reply to this email to respond directly to the enquirer.';
    return implode("\r\n", $lines);
}

/**
 * Sends a plain-text UTF-8 message. Uses authenticated SMTP when configured (recommended on
 * Hostinger: smtp.hostinger.com, port 465, "ssl"), otherwise falls back to PHP mail().
 */
function send_mail(array $config, string $replyEmail, string $replyName, string $subject, string $body): void
{
    $to = (string) $config['to_email'];
    $from = (string) $config['from_email'];
    $date = date(DATE_RFC2822);
    $messageId = sprintf('<%s@%s>', bin2hex(random_bytes(12)), substr(strrchr($from, '@') ?: '@localhost', 1));
    $encodedBody = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));

    $headers = [
        'Date: ' . $date,
        'From: ' . format_address($from, (string) ($config['from_name'] ?? 'Website')),
        'Reply-To: ' . format_address($replyEmail, $replyName),
        'Message-ID: ' . $messageId,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'X-Mailer: SpaceCraft-Website',
    ];

    $smtp = $config['smtp'] ?? null;
    if (!is_array($smtp) || empty($smtp['host'])) {
        $ok = mail($to, encode_header($subject), $encodedBody, implode("\r\n", $headers), '-f' . $from);
        if (!$ok) {
            throw new RuntimeException('mail() returned false');
        }
        return;
    }

    $data = implode("\r\n", array_merge(
        $headers,
        ['To: ' . format_address($to, (string) ($config['to_name'] ?? '')), 'Subject: ' . encode_header($subject), '', $encodedBody]
    ));
    smtp_send($smtp, $from, $to, $data);
}

function smtp_send(array $s, string $from, string $to, string $data): void
{
    $host = (string) $s['host'];
    $port = (int) ($s['port'] ?? 465);
    $secure = strtolower((string) ($s['secure'] ?? 'ssl'));
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;

    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        throw new RuntimeException("SMTP connect to $host:$port failed ($errno $errstr)");
    }
    stream_set_timeout($fp, 15);

    $read = function () use ($fp): string {
        $reply = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $reply .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $reply;
    };
    // $label is what gets logged on failure, so credentials never reach the error log.
    $cmd = function (?string $line, array $expect, string $label) use ($fp, $read): void {
        if ($line !== null) fwrite($fp, $line . "\r\n");
        $reply = $read();
        if (!in_array((int) substr($reply, 0, 3), $expect, true)) {
            throw new RuntimeException("SMTP $label failed: " . trim(substr($reply, 0, 200)));
        }
    };

    try {
        $ehlo = 'EHLO ' . preg_replace('/[^A-Za-z0-9.\-]/', '', (string) ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        $cmd(null, [220], 'greeting');
        $cmd($ehlo, [250], 'EHLO');
        if ($secure === 'tls') {
            $cmd('STARTTLS', [220], 'STARTTLS');
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                throw new RuntimeException('SMTP TLS negotiation failed');
            }
            $cmd($ehlo, [250], 'EHLO after STARTTLS');
        }
        $cmd('AUTH LOGIN', [334], 'AUTH');
        $cmd(base64_encode((string) $s['username']), [334], 'AUTH username');
        $cmd(base64_encode((string) $s['password']), [235], 'AUTH password');
        $cmd('MAIL FROM:<' . $from . '>', [250], 'MAIL FROM');
        $cmd('RCPT TO:<' . $to . '>', [250, 251], 'RCPT TO');
        $cmd('DATA', [354], 'DATA');
        // Dot-stuffing (RFC 5321 §4.5.2); base64 bodies never start with ".", headers might.
        $payload = preg_replace('/^\./m', '..', $data);
        $cmd($payload . "\r\n.", [250], 'message body');
        $cmd('QUIT', [221], 'QUIT');
    } finally {
        fclose($fp);
    }
}

/* -------------------------------------------------------------------- main */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'That message is too long.']);
}

$config = load_config();

foreach (['to_email', 'from_email'] as $key) {
    $value = (string) ($config[$key] ?? '');
    if (!filter_var($value, FILTER_VALIDATE_EMAIL) || stripos($value, 'CHANGE_ME') !== false) {
        fail_server("Config '$key' is not set to a real address.");
    }
}

// Only accept submissions sent from our own pages.
$allowedHosts = array_map('strtolower', (array) ($config['allowed_hosts'] ?? []));
$originHost = request_origin_host();
if ($originHost === null || !in_array($originHost, $allowedHosts, true)) {
    respond(403, ['ok' => false, 'error' => 'This form can only be submitted from our website.']);
}

$post = function (string $key): string {
    $v = $_POST[$key] ?? '';
    return is_string($v) ? clean($v) : '';
};

// Bots: a filled honeypot or an impossibly fast submission gets a normal-looking success
// response, so the bot learns nothing, but nothing is sent.
$minMs = (int) ($config['min_fill_ms'] ?? 3000);
$elapsed = (int) $post('elapsed_ms');
if ($post('website') !== '' || $elapsed < $minMs) {
    respond(200, ['ok' => true]);
}

$ip = client_ip($config);
if (!rate_limit_ok($config, $ip)) {
    respond(429, ['ok' => false, 'error' => "You've sent several enquiries in a short time. Please wait a while before trying again."]);
}

$turnstileSecret = (string) ($config['turnstile_secret'] ?? '');
if ($turnstileSecret !== '' && !turnstile_ok($turnstileSecret, $post('cf-turnstile-response'), $ip)) {
    respond(400, ['ok' => false, 'error' => 'Please complete the security check and try again.']);
}

$data = [];
foreach (array_keys(FIELD_LABELS) as $field) {
    $data[$field] = $post($field);
}
// Single-line fields never contain newlines.
foreach ($data as $field => $value) {
    if ($field !== 'message') $data[$field] = preg_replace('/\s+/u', ' ', $value) ?? '';
}

$errors = validate($data);
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields and try again.', 'fields' => $errors]);
}

$subject = sprintf(
    'Website enquiry: %s — %s%s',
    PROJECT_TYPES[$data['projectType']],
    header_safe($data['name']),
    $data['company'] !== '' ? ' (' . header_safe($data['company']) . ')' : ''
);

try {
    send_mail($config, $data['email'], $data['name'], $subject, build_body($data));
} catch (Throwable $e) {
    fail_server('Send failed: ' . $e->getMessage());
}

respond(200, ['ok' => true]);
