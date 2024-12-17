# Backend

This is the data access layer. This layer:

- Handles retrieving data [according to the principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)
- Authorizes that the user (or alternative auth mechanism) can access the resource
- Is agnostic of where it is used; it can be used in the dashboard or future API
- Defines input schemas and validates
- Outputs type definitions

This layer does not:

- Provide authentication (just authorization)
