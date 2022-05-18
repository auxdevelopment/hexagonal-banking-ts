# Hexagonal Architecture Showcase - Primitive Banking System (WIP)

This is a sample application aiming to showcase an example implementation of hexagonal architecture using TypeScript.

## Domain Description

The application is concerned with bank accounts and transfers between them.

### Entities

- Account
- AccountHolder

### Use Cases

- DebitAccount
- ViewCurrentBalance
- OpenAccount
- CloseAccount

## Project Layout

### `src/core/domain`

Contains all domain objects (aggregates, entities, values, ...) and tests related to them.

### `src/core/use-case`

Contains primary ports for all use cases the application implements.

### `src/infrastructure`

Contains all infrastructure related adapters (e.g. `PostgresAccountRepository`).

### `src/infrastructure/rest-api`

Contains everything related to the exposed REST API.
