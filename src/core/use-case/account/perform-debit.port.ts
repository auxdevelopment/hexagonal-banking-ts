import { AccountId } from "../../domain/account/account-id.value";

export interface PerformDebit {
    performDebit(fromAccount: AccountId, toAccount: AccountId, amount: number): Promise<void>;
}