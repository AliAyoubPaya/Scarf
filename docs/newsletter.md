# Newsletter setup

The footer supports a public Mailchimp or Klaviyo hosted signup form. Set
`NEWSLETTER_SIGNUP_URL` to the HTTPS signup form link in `.env.local` and the
deployment environment, then rebuild. Do not use an API key, dashboard URL,
or a form submission endpoint.

With a valid URL, the newsletter banner shows "Join the list" and opens the
provider's hosted form. The provider collects email addresses, records consent,
and handles confirmation. This storefront does not store email addresses or
claim that a visitor subscribed just by clicking the link.

Without a valid URL, it shows "Coming soon" and links to the brand's Instagram.
An embedded email field can be connected separately once the provider and
its form integration are available.
