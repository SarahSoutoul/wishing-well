# Wishing Well API

## Installation

`npm install -D`

## Development

The project requires the following environment variables, ideally in a `.env` file.

```bash
PORT=XXXX
DB_URL=XXXX
```

`DB_URL` should be a valid PostgreSQL connection string.

With these variables in place, the project can be run with `npm run dev`.

## Routes

| Route | Method | Response |
| --- | --- | --- |
| `/` | `GET` | API welcome message |
| `/futureproof` | `GET` | Easter egg |
| `/tags` | `GET` | List of all tags |
| `/tags` | `POST` | Create a new tag |
| `/wishes` | `GET` | List of all wishes |
| `/wishes` | `POST` | Create a new wish |
| `/wishes/:id` | `GET` | View a specific wish |
| `/wishes/:id` | `PATCH` | Edit a specific wish |
| `/wishes/:id/comments` | `GET` | Get all comments for a specific wish |
| `/wishes/:id/comments` | `POST` | Create a new comment on a specific wish |
| `/wishes/:id/comments/:id` | `GET` | View a specific comment on a specific wish |
| `/wishes/:id/comments/:id` | `PATCH` | Edit a specific comment on a specific wish |

## Data

The data used by this API is stored in a PostgreSQL database.

[A high-level ERD can be found here.](https://whimsical.com/wishing-well-erd-NmpPD3ZcMDYLTWv3FvBzt1)

`npm run setup` will populate a linked database with all required tables.