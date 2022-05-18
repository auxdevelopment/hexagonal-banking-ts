import { AccountHolder, AccountHolderId } from "./account-holder.aggregate";

// AccountHolderRepository is a secondary port for
// persisting and retrieving AccountHolder aggregates.
export interface AccountHolderRepository {
    findOne(id: AccountHolderId): Promise<AccountHolder>;
    save(accountHolder: AccountHolder): Promise<void>;
}