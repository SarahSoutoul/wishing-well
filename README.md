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
| `/` | `GET` | A JSON object describing the API |

## Data

The data used by this API is stored in a PostgreSQL database.

[A high-level ERD can be found here.](https://whimsical.com/wishing-well-erd-NmpPD3ZcMDYLTWv3FvBzt1)

`npm run setup` will populate a linked database with all required tables.