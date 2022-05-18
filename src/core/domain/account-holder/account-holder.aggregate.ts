import { AccountClosedEvent } from "../account/events/account-closed.event";
import { AccountId } from "../account/account-id.value";
import { IllegalValueError } from "../illegal-value.error";
import { AccountOpenedEvent } from "../account/events/account-opened.event";

// AccountId is a value object.
export class AccountHolderId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new IllegalValueError('AccountId must not be empty')
        }

        // perform sophisticated validation logic ...
    }
}

// AccountHolder is an aggregate root.
// It represents an account holder.
export class AccountHolder {
    constructor(
        public readonly id: AccountHolderId,
        private readonly heldAccounts: Set<AccountId>,
        private readonly activeAccounts: Set<AccountId>
    ) {}

    public async acceptAccountClosed(event: AccountClosedEvent): Promise<void> {
        const concernsAccountHolder = this.heldAccounts.has(event.accountId);
        if(!concernsAccountHolder) {
            return;
        }

        this.activeAccounts.delete(event.accountId);
    }

    public async acceptAccountOpened(event: AccountOpenedEvent): Promise<void> {
        const concernsAccountHolder = this.heldAccounts.has(event.accountId);
        if(!concernsAccountHolder) {
            return;
        }

        this.activeAccounts.delete(event.accountId);
    }

    public isHighValueCustomer() {
        return this.activeAccounts.size > 3;
    }
}