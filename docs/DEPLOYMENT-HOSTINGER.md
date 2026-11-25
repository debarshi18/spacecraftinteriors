# Deploying to Hostinger

> Phase 8 completes this guide (build upload, `.htaccess`, redirects, caching). This section covers the enquiry form.

## Enquiry form (`/api/contact.php`)

The static site posts the contact form to `public/api/contact.php`, which `npm run build` copies to `out/api/contact.php`. It needs a private config file on the server — **secrets never go in the website code or inside `public_html`.**

### 1. Create the mailbox

hPanel → **Emails** → create a mailbox on the domain (for example an enquiries address). Note its password.

### 2. Upload the private config

1. Open hPanel → **File Manager** and go to the folder that **contains** `public_html`
   (usually `/home/u…/domains/officeinteriordesignerkolkata.com/`).
2. Create a folder named `spacecraft-private` next to `public_html`, not inside it.
3. Upload `deploy/contact-config.example.php` into it and rename it to `contact-config.php`.
4. Edit it and replace every `CHANGE_ME`:
   - `to_email` — where enquiries should arrive.
   - `from_email` and `smtp.username` — the mailbox from step 1 (must be the same address).
   - `smtp.password` — that mailbox's password.
   - `hash_secret` — any long random string.
5. The form refuses to send (and logs an error) until real addresses are set.

```
domains/officeinteriordesignerkolkata.com/
├── public_html/            ← contents of out/
│   └── api/contact.php
└── spacecraft-private/     ← NOT web-accessible
    ├── contact-config.php
    └── storage/            ← created automatically for rate-limit data
```

### 3. Test it

Submit the form on the live site. If nothing arrives:

- hPanel → **Advanced → PHP Configuration**: use PHP 8.1 or newer.
- Check the error log (hPanel → **Advanced → Error logs**, or `public_html/error_log`) for lines starting `[spacecraft-contact]`. They contain no enquiry details.
- `SMTP AUTH password failed` means the mailbox password is wrong. `connect failed` means the host or port is wrong; try `'port' => 587, 'secure' => 'tls'`.

### Spam protection built in

| Layer | What it does |
|---|---|
| Origin check | Only accepts submissions sent from the hosts in `allowed_hosts`. |
| Honeypot | A hidden `website` field; bots that fill it get a fake success and nothing is sent. |
| Time trap | Submissions faster than `min_fill_ms` (3 s) are treated the same way. |
| Rate limit | 5 enquiries per visitor per hour by default. IPs are stored only as keyed hashes. |
| Validation | Every field is re-checked on the server with the same rules as the browser. |
| Header safety | Line breaks are stripped from anything used in email headers. The enquirer's address is only used as `Reply-To`. |
| Turnstile (optional) | See below. |

No auto-reply is sent to the enquirer: an auto-reply would let anyone use the form to send email to arbitrary addresses.

### Optional: Cloudflare Turnstile

Only add this if spam gets through the layers above.

1. Create a free Turnstile widget at dash.cloudflare.com for the domain.
2. Put the **site key** in `data/site-config.ts` → `integrations.turnstileSiteKey`, then rebuild and upload.
3. Put the **secret key** in `contact-config.php` → `turnstile_secret`.

Set both or neither: a secret without the site key rejects every submission.

### Local development

`npm run dev` simulates a successful send. The PHP file only runs on the server.
