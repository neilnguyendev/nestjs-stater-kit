<h1 align="center">NestJS + Typescript + TypeORM + MySQL</h1>

<p align="center">
  <a href="https://docs.nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-v9-blueviolet.svg?logo=Nestjs"></a>
</p>

Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.

This project helps you:

1. Understand Nest's code flow and concepts: controllers, providers, modules, etc,...
2. Base authentication is ready, using JWT token.
3. Available modules for reusing or referencing: auth, users, mail.
4. Common classes for: entity DTO, pagination.
5. ORM sets up for MySQL, includes DB migration.
6. Snowflake ID is available.
7. Swagger is integrated.
8. Can develop your project easily and quickly.

See more: https://docs.nestjs.com/

## Starting template with:
- NestJS
- Typescript
- Class transformer, Class validator 
- TypeORM
- MySQL, DB migration
- Passport Jwt
- Snowflake ID
- Eslint, Prettier
- Jest
- Docker

## Configurations

.env file:

```bash
#== ENVIRONMENT
NODE_ENV=<production or development>

#== APP
PORT=<port to run the app>
DOMAIN=<domain of the app>

#== JWT Auth
JWT_KEY=<paste a key for JWT_KEY>
JWT_ACCESS_EXPIRATION_TIME=3600
JWT_REFRESH_EXPIRATION_TIME=86400

#== DB
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=<database name>
# If you use Docker, please also edit database name at the file docker/mysql/docker-entrypoint-initdb.d/createdb.sql
MYSQL_USERNAME=root
MYSQL_PASSWORD=<paste password here>

# Mail
MAIL_HOST=smtp.example.com
MAIL_USER=user@example.com
MAIL_PASSWORD=
MAIL_FROM=noreply@example.com
```

## Install and run the app
For development (Node 16, Yarn):
```bash
$ yarn
$ yarn dev
```

For running on live servers:
```bash
$ docker-compose up -d

# Then please config Nginx
```

## Migration
```bash
# Run migrations
$ yarn migrate

# Create migration
$ yarn migration:create src/database/migrations/<name-of-migration>

# Revert migration
$ yarn migration:revert 
```
