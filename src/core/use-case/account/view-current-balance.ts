import { AccountId } from "../../domain/account/account-id.value";
import { Balance } from "../../domain/account/balance.value";

export interface ViewCurrentBalance {
    viewCurrentBalance(accountId: AccountId): Promise<Balance>;
}