import { OpenAccountCommand } from "../../use-case/account/open-account.port";
import { AccountHolderId } from "../account-holder/account-holder.aggregate";
import { AggregateRoot } from "../aggregate.base";
import { AccountClosedEvent } from "./events/account-closed.event";
import { AccountId } from "./account-id.value";
import { AccountStatus } from "./account-status";
import { Balance } from "./balance.value";
import { AccountOpenedEvent } from "./events/account-opened.event";

export class CannotDebitClosedAccountError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class OverdraftLimitExceededError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export interface AccountProps {
    readonly id: AccountId,
    readonly heldBy: AccountHolderId,
    readonly balance: Balance,
    readonly overdraftLimit: number,
    readonly status: AccountStatus,
}

// Account is an aggregate root.
// Invariants:
//  -) balance < (0 - Account.overdraftLimit)
//  -) when(Account.status == CLOSED) => no debits (from & to) are allowed
export class Account extends AggregateRoot<AccountId> {
    public static create(command: OpenAccountCommand): Account {
        const accountToOpen = new Account(
            command.accountId,
            command.accountHolderId,
            Balance.initial(),
            command.overdraftLimit,
            AccountStatus.OPEN
        );

        accountToOpen.publish(new AccountOpenedEvent(accountToOpen.id, accountToOpen.heldBy));

        return accountToOpen;
    }

    constructor(
        id: AccountId,
        private readonly heldBy: AccountHolderId,
        private balance: Balance,
        private readonly overdraftLimit: number,
        private status: AccountStatus,
    ) {
        super(id);
    }

    private isClosed(): boolean {
        return this.status === AccountStatus.CLOSED;
    }

    // debitTo debits a given amount to the account.
    public debitTo(amount: number): void {
        if (this.isClosed()) {
            throw new CannotDebitClosedAccountError(`Account ${this.id} is closed.`);
        }

        this.balance = this.balance.debitTo(amount);
    }

    // debitFrom debits a given amount from the account.
    public debitFrom(amount: number): void {
        const newBalance = this.balance.debitFrom(amount);

        const exceedsBalance = newBalance.value < (0 - this.overdraftLimit);
        if (exceedsBalance) {
            throw new OverdraftLimitExceededError(`Overdraft limit of ${this.overdraftLimit} would be exceeded.`);
        }

        this.balance = newBalance;
    }

    public close(): void {
        this.status = AccountStatus.CLOSED;
        this.publish(new AccountClosedEvent(this.id, this.heldBy));
    }

    public currentBalance(): Balance {
        return this.balance;
    }

    // Data Transfer Object
    public toDto(): AccountProps {
        return {
            id: this.id,
            heldBy: this.heldBy,
            balance: this.balance,
            overdraftLimit: this.overdraftLimit,
            status: this.status,
        }
    }
}