import { AccountId } from "./account-id.value";
import { Account } from "./account.aggregate";

// AccountRepository is a secondary port.
// It retrieves and persists accounts.
export interface AccountRepository {
    findOne(id: AccountId): Promise<Account>;
    save(account: Account): Promise<void>;
    saveAll(accounts: Account[]): Promise<void>;
}