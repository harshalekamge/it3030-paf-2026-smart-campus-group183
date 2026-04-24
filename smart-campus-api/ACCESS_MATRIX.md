# Access Matrix

Base URL for local testing:

`http://localhost:8080/api`

Notes:

- This project currently has these roles in code: `SUPER_ADMIN`, `ADMIN`, `STAFF`, `LECTURER`, `STUDENT`
- `SUPER_ADMIN` is treated as an admin superset
- `LECTURER` currently has the same access as staff for `resource-types` and `amenities`
- Public endpoints do not require login
- Protected endpoints return `401` when not logged in and `403` when logged in without permission

## Current Backend Access Matrix

| Endpoint | SUPER_ADMIN | ADMIN | STAFF | LECTURER | STUDENT | Unauthenticated |
|---|---|---|---|---|---|---|
| `GET /hello` | Allow | Allow | Allow | Allow | Allow | Allow |
| `GET /auth/login-success` | Allow | Allow | Allow | Allow | Allow | Allow |
| `GET /auth/login-failure` | Allow | Allow | Allow | Allow | Allow | Allow |
| `POST /auth/logout` | Allow | Allow | Allow | Allow | Allow | Allow |
| `GET /users/me` | Allow | Allow | Allow | Allow | Allow | Deny |
| `GET /users` | Allow | Allow | Deny | Deny | Deny | Deny |
| `PATCH /users/{id}/role` | Allow | Allow | Deny | Deny | Deny | Deny |
| `POST /resource-types` | Allow | Allow | Allow | Allow | Deny | Deny |
| `GET /resource-types` | Allow | Allow | Allow | Allow | Allow | Deny |
| `GET /resource-types/{id}` | Allow | Allow | Allow | Allow | Allow | Deny |
| `PUT /resource-types/{id}` | Allow | Allow | Allow | Allow | Deny | Deny |
| `DELETE /resource-types/{id}` | Allow | Allow | Deny | Deny | Deny | Deny |
| `POST /amenities` | Allow | Allow | Allow | Allow | Deny | Deny |
| `GET /amenities` | Allow | Allow | Allow | Allow | Allow | Deny |
| `GET /amenities/{id}` | Allow | Allow | Allow | Allow | Allow | Deny |
| `PUT /amenities/{id}` | Allow | Allow | Allow | Allow | Deny | Deny |
| `DELETE /amenities/{id}` | Allow | Allow | Deny | Deny | Deny | Deny |

## Simplified 3-Role View

This is the same matrix collapsed into the roles you originally asked for.

| Endpoint | ADMIN | STAFF | STUDENT |
|---|---|---|
| `GET /hello` | Allow | Allow | Allow |
| `GET /auth/login-success` | Allow | Allow | Allow |
| `GET /auth/login-failure` | Allow | Allow | Allow |
| `POST /auth/logout` | Allow | Allow | Allow |
| `GET /users/me` | Allow | Allow | Allow |
| `GET /users` | Allow | Deny | Deny |
| `PATCH /users/{id}/role` | Allow | Deny | Deny |
| `POST /resource-types` | Allow | Allow | Deny |
| `GET /resource-types` | Allow | Allow | Allow |
| `GET /resource-types/{id}` | Allow | Allow | Allow |
| `PUT /resource-types/{id}` | Allow | Allow | Deny |
| `DELETE /resource-types/{id}` | Allow | Deny | Deny |
| `POST /amenities` | Allow | Allow | Deny |
| `GET /amenities` | Allow | Allow | Allow |
| `GET /amenities/{id}` | Allow | Allow | Allow |
| `PUT /amenities/{id}` | Allow | Allow | Deny |
| `DELETE /amenities/{id}` | Allow | Deny | Deny |

## How To Verify

1. Log in at `http://localhost:8080/api/auth-demo.html`
2. Confirm your role with `GET /users/me`
3. Open `http://localhost:8080/api/swagger-ui.html`
4. Test one allowed endpoint and one denied endpoint for that role
5. Use `POST /auth/logout` before switching accounts
