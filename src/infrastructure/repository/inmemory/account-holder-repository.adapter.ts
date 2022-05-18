import { AccountHolderRepository } from "../../../core/domain/account-holder/account-holder-repository.port";
import { AccountHolderId, AccountHolder } from "../../../core/domain/account-holder/account-holder.aggregate";

export class InMemoryAccountHolderRepository implements AccountHolderRepository {
    private readonly accountHolders: Array<AccountHolder>;

    constructor() {
        this.accountHolders = new Array<AccountHolder>();
    }

    public async findOne(id: AccountHolderId): Promise<AccountHolder> {
        const accountHolder = this.accountHolders.find(holder => holder.id.value === id.value);
        if (!accountHolder) {
            throw Error(`No such account holder`);
        }

        return accountHolder;
    }

    public async save(accountHolder: AccountHolder): Promise<void> {
        const existing = this.accountHolders.find(holder => holder.id.value === accountHolder.id.value);
        if (!existing) {
            this.accountHolders.push(accountHolder);
        }

        // update happened by reference
        return;
    }
}