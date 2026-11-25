<?php
/**
 * Enquiry form configuration — TEMPLATE.
 *
 * 1. Copy this file to the server OUTSIDE public_html, at:
 *      <folder that contains public_html>/spacecraft-private/contact-config.php
 *    e.g. /home/u123456789/domains/officeinteriordesignerkolkata.com/spacecraft-private/contact-config.php
 * 2. Replace every CHANGE_ME value. The form refuses to send until you do.
 * 3. Never commit the real file or upload it inside public_html.
 *
 * See docs/DEPLOYMENT-HOSTINGER.md for the step-by-step guide.
 */

return [
    // Where enquiries are delivered.
    'to_email' => 'CHANGE_ME@officeinteriordesignerkolkata.com',
    'to_name' => 'SpaceCraft Interiors',

    // Sender. With Hostinger SMTP this MUST be the same mailbox as smtp.username.
    'from_email' => 'CHANGE_ME@officeinteriordesignerkolkata.com',
    'from_name' => 'SpaceCraft Website',

    // Authenticated SMTP (recommended — far better deliverability than PHP mail()).
    // Hostinger: hPanel → Emails → create the mailbox, then use its address and password here.
    // Set 'smtp' => null to fall back to PHP mail().
    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'secure' => 'ssl',          // 'ssl' for port 465, 'tls' for port 587 (STARTTLS)
        'username' => 'CHANGE_ME@officeinteriordesignerkolkata.com',
        'password' => 'CHANGE_ME',
    ],

    // Hosts allowed to submit the form (checked against the browser's Origin/Referer header).
    'allowed_hosts' => [
        'officeinteriordesignerkolkata.com',
        'www.officeinteriordesignerkolkata.com',
    ],

    // Cloudflare Turnstile secret key (optional). Set it ONLY together with
    // integrations.turnstileSiteKey in data/site-config.ts, otherwise every submission is rejected.
    'turnstile_secret' => '',

    // Spam & abuse controls.
    'min_fill_ms' => 3000,                                   // faster submissions are treated as bots
    'rate_limit' => ['max' => 5, 'window_seconds' => 3600],  // per visitor
    'storage_dir' => __DIR__ . '/storage',                   // rate-limit data, outside public_html
    'hash_secret' => 'CHANGE_ME-to-a-long-random-string',    // IPs are stored only as keyed hashes

    // Set true only if the site is proxied through Cloudflare.
    'trust_cloudflare_ip' => false,
];
