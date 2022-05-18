import { CloseAccount } from "../../use-case/account/close-account.port";
import { OpenAccount, OpenAccountCommand } from "../../use-case/account/open-account.port";
import { PerformDebit } from "../../use-case/account/perform-debit.port";
import { ViewCurrentBalance } from "../../use-case/account/view-current-balance";
import { AccountId } from "./account-id.value";
import { AccountRepository } from "./account-repository.port";
import { Account } from "./account.aggregate";
import { Balance } from "./balance.value";

// AccountService is an application service that implements the account use cases.
// It is a primary adapter as it implements multiple primary ports.
export class AccountService implements OpenAccount, CloseAccount, PerformDebit, ViewCurrentBalance {
    constructor(private readonly repository: AccountRepository) {}

    public async openAccount(command: OpenAccountCommand): Promise<Account> {
        const accountToOpen = Account.create(command);

        await this.repository.save(accountToOpen);

        return accountToOpen;
    }

    public async closeAccount(accountId: AccountId): Promise<Account> {
        const accountToClose = await this.repository.findOne(accountId);

        accountToClose.close();

        await this.repository.save(accountToClose);

        return accountToClose;
    }

    public async performDebit(fromAccountId: AccountId, toAccountId: AccountId, amount: number): Promise<void> {
        const fromAccount = await this.repository.findOne(fromAccountId);
        const toAccount = await this.repository.findOne(toAccountId);

        fromAccount.debitFrom(amount);
        toAccount.debitTo(amount);

        // Note: this violates the DDD aggregate rules as
        // an aggregate is a consistency boundary.
        // Use eventual consistency through domain events
        // in a real world application instead.
        return this.repository.saveAll([fromAccount, toAccount]);
    }

    public async viewCurrentBalance(accountId: AccountId): Promise<Balance> {
        const account = await this.repository.findOne(accountId);
        return account.currentBalance();
    }
}