# Mapform App

## Authentication

Mapform uses a JWT session strategy for authentication, however, Magic Links are store in the database and expired upon use.

The JWT is verified in Middleware and can be used to provide broad authentication coverage across the entire app.

Authorization is handled at the action-level. The `authClient` action will:

- Ensure the user is authenticated. If not, the user is redirected to /signin
- Ensure the user has access to all workspace-level requests. If not, the user is redirected the application root (which will redirect them accoringly)
- Ensure the user has access to all teamspace-level requests. If not, the user is redirected to their root workspace

NOTE: Any workspace or teamspace-level pages that DO NOT call the authClient action client will likely require MANUAL authorization checks.
