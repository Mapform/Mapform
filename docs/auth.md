# Auth

Basic auth is implemented using stateless JWT tokens, which more or less follow this guide: https://lucia-auth.com/sessions/stateless-tokens

A few notes:

1. The authClient (in lib/safe-action.ts) does most of the heavy lifting. It validates the token, and fetches the user with workspace to expose within the workspace context.

2. The middleware handles renewing the token if the current token is set to expire within 12 hours. The middleware also adds CSRF protection.
