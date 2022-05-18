import { AccountService } from "./core/domain/account/account-service.adapter";
import connection from "./infrastructure/knex/config";
import { PostgresAccountRepository } from "./infrastructure/repository/postgresql/account-repository.adapter";
import { AccountController } from "./infrastructure/rest-api/controller/account/account.controller";
import { ExpressServer } from "./infrastructure/rest-api/server";

(async () => {
    const knex = connection;
    const postgresAccountRepository = new PostgresAccountRepository(knex);
    const accountService = new AccountService(postgresAccountRepository);

    const accountController = new AccountController(accountService, accountService, accountService, accountService);
    const server = new ExpressServer([accountController]);

    server.listen(8080, () => console.log('Listening...'));
})();