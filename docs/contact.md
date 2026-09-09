# Contact page

Route: `/pages/contact`. Header and footer already link here. Each section is kept separately in `components/local/contact/` and uses the shared SiteContainer and brand gold tokens. No original shadcn component is modified.

The design follows Pipeline’s contact page structure (image banner, help options, form, FAQ), adapted to scarves. The existing owned scarf still-life is reused. No demo store address, phone number, return promise or opening hours has been copied.

## Delivery modes

By default no messages are submitted or stored. The form validates a draft, copies it on user request, and directs the visitor to the verified Instagram profile. Clipboard failures show a selectable draft. The visitor must paste and send the message themselves. Personal details are not persisted in localStorage or logged.

Optional `CONTACT_EMAIL` can be set to the confirmed public business email in `.env.local` and the deployment environment. Restart/rebuild after changing it. This enables the reply-email field, public email link and an explicitly labelled email-app handoff via `mailto:`. It does not enable server-side email delivery. A fallback draft remains available if no email app opens.

For direct website delivery, confirm a recipient and an email provider first, then add a server-side integration with validation, anti-spam/rate limiting and provider-confirmed submission states. Mailchimp/Klaviyo newsletter setup is separate from customer support delivery.

## Checks

- Desktop/mobile layout and no horizontal overflow.
- Empty form blocks copying; whitespace-only name/message produces feedback.
- Valid draft copies, but never claims it has been sent.
- Clipboard failure provides a manual-copy alternative.
- FAQ summaries work with keyboard and touch without client JavaScript.
