import { AccountId } from "../../domain/account/account-id.value";
import { Account } from "../../domain/account/account.aggregate";

export interface CloseAccount {
    closeAccount(accountId: AccountId): Promise<Account>;
}