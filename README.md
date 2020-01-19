# NATA-NC-NEWS

API to use along the [nata-nc-news Front End](https://github.com/Natalalia/nata-nc-news-fe). The database is in PSQL and [Knex](https://knexjs.org) is used to interact with it.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

If you want to play around with this projects, feel free to clone the repository! You will need to have `node` and `PostgreSQL` installed.

### Installing

In order to install the correspondent dependencies indicated in the package.json :

```bash
npm install
```

You will also need to create a `knexfile.js` in the root folder in order to connect to your databases:

```js
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  development: {
    connection: {
      database: "nata_nc_news"
      //username:
      //password:
    }
  },
  test: {
    connection: {
      database: "nata_nc_news_test"
      //username:
      //password:
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

Before you can being testing the project, you will need to create and seed the databases:

```bash
npm run setup-dbs
```

All the endpoints have been tested in a test environment. So, by seeding the test database you will be able to run those tests:

```bash
npm run seed
```

On the other hand, if you want to seed the dev data, you can do so by running this script:

```bash
npm run seed:prod
```

To check the functionality, you can start the server by running:

```bash
npm run dev
```

This will start the server listening on Port 9090.

## Running the tests

This project comes with several tests for each endpoint covering from happy path testing a route to handling error, thinking about how a client or internal problem could make it go wrong.

It also tests the util functions needed when seeding the database.

Run tests:

```bash
npm test
```

## Built With

- Node.js
- Express
- PostgreSQL
- knex
- Heroku

## Available Scripts

Create development and test databases locally:

```bash
npm run setup-dbs
```

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Rollback, migrate -> latest, then start inserting data into the database:

```bash
npm run seed
```

Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

Run the server with `node`:

```bash
npm start
```
