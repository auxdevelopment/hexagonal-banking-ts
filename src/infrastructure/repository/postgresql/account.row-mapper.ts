import { AccountHolderId } from "../../../core/domain/account-holder/account-holder.aggregate";
import { AccountId } from "../../../core/domain/account/account-id.value";
import { AccountStatus } from "../../../core/domain/account/account-status";
import { Account } from "../../../core/domain/account/account.aggregate";
import { Balance } from "../../../core/domain/account/balance.value";
import { AccountModel } from "./account-repository.adapter";

export class AccountRowMapper {
    public static rowToDomain(row: AccountModel): Account {
        return new Account(
            new AccountId(row.id),
            new AccountHolderId(row.held_by),
            new Balance(row.balance),
            row.overdraft_limit,
            row.account_status as AccountStatus
        );
    }

    public static domainToRow(account: Account): AccountModel {
        const dto = account.toDto();

        return {
            id: dto.id.value,
            held_by: dto.heldBy.value,
            balance: dto.balance.value,
            overdraft_limit: dto.overdraftLimit,
            account_status: dto.status,
        };
    }
}