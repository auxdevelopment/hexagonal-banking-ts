import { AccountHolderId } from "../../domain/account-holder/account-holder.aggregate";
import { AccountId } from "../../domain/account/account-id.value";
import { Account } from "../../domain/account/account.aggregate";

export interface OpenAccountCommand {
    accountId: AccountId;
    accountHolderId: AccountHolderId;
    overdraftLimit: number,
}

export interface OpenAccount {
    openAccount(command: OpenAccountCommand): Promise<Account>;
}