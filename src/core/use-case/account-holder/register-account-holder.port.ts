import { AccountHolderId } from "../../domain/account-holder/account-holder.aggregate";

export interface RegisterAccountHolder {
    registerAccountHolder(accountHolderId: AccountHolderId): Promise<void>;
}