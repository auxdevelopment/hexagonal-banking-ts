import { CloseAccount } from "../../../../core/use-case/account/close-account.port";
import { OpenAccount } from "../../../../core/use-case/account/open-account.port";
import { PerformDebit } from "../../../../core/use-case/account/perform-debit.port";
import { ViewCurrentBalance } from "../../../../core/use-case/account/view-current-balance";
import { Express, Request, Response } from 'express';
import { AccountId } from "../../../../core/domain/account/account-id.value";
import { AccountHolderId } from "../../../../core/domain/account-holder/account-holder.aggregate";
import { Controller } from "../../controller";
import { AccountResource } from "./resources/account.resource";
import { AccountProps } from "../../../../core/domain/account/account.aggregate";
import { CreateAccountRequest } from "./resources/create-account.resource";
import { PatchAccountRequest } from "./resources/patch-account.resource";
import { PerformDebitRequest } from "./resources/perform-debit.resource";

export class AccountMapper {
    static dtoToRest(dto: AccountProps) {
        const resource: AccountResource = {
            id: dto.id.value,
            held_by: dto.heldBy.value,
            balance: dto.balance.value,
            overdraft_limit: dto.overdraftLimit,
            status: dto.status
        };

        return resource;
    }
}

export class AccountController implements Controller {
    constructor(
        private readonly openAccountUseCase: OpenAccount,
        private readonly closeAccountUseCase: CloseAccount,
        private readonly performDebitUseCase: PerformDebit,
        private readonly viewCurrentBalanceUseCase: ViewCurrentBalance
     ){}

    public register(server: Express) {
        server.put('/account/:id', (request, response) => this.handleOpenAccount(request, response));
        server.get('/account/:id/balance', (request, response) => this.handleViewCurrentBalance(request, response));
        server.patch('/account/:id', (request, response) => this.handleCloseAccount(request, response));

        server.post('/debit', (request, response) => this.handlePerformDebit(request, response));
    }

    public async handleOpenAccount(request: Request, response: Response) {
        const createRequest: CreateAccountRequest = request.body as CreateAccountRequest;
        const accountId = request.params.id;

        const created = await this.openAccountUseCase.openAccount({
            accountId: new AccountId(accountId),
            accountHolderId: new AccountHolderId(createRequest.held_by),
            overdraftLimit: createRequest.overdraft_limit
        });

        const dto = created.toDto();

        response.send(AccountMapper.dtoToRest(dto));
    }

    public async handleCloseAccount(request: Request, response: Response) {
        const closeRequest: PatchAccountRequest = request.body as PatchAccountRequest;
        if (closeRequest.status != 'CLOSED') {
            throw Error('validation error');
        }

        const accountId = new AccountId(request.params.id);

        const closed = await this.closeAccountUseCase.closeAccount(accountId);

        response.send(AccountMapper.dtoToRest(closed.toDto()));
    }

    public async handlePerformDebit(request: Request, response: Response) {
        const performDebitRequest: PerformDebitRequest = request.body as PerformDebitRequest;

        await this.performDebitUseCase.performDebit(
            new AccountId(performDebitRequest.from_account),
            new AccountId(performDebitRequest.to_account),
            performDebitRequest.amount
        );

        response.send({
            processed_at: Date.now() / 1000
        });
    }

    public async handleViewCurrentBalance(request: Request, response: Response) {
        const accountId = new AccountId(request.params.id);

        const balance = await this.viewCurrentBalanceUseCase.viewCurrentBalance(accountId);

        response.send({
            id: accountId.value,
            balance: balance
        });
    }
}