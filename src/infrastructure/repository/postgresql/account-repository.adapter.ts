import { Knex } from "knex";
import { AccountId } from "../../../core/domain/account/account-id.value";
import { AccountRepository } from "../../../core/domain/account/account-repository.port";
import { Account } from "../../../core/domain/account/account.aggregate";
import { NoSuchAccountError } from "../../../core/domain/account/no-such-account.error";
import { AccountRowMapper } from "./account.row-mapper";

export interface AccountModel {
    id: string;
    held_by: string;
    balance: number;
    overdraft_limit: number;
    account_status: string;
}

// PostgresAccountRepository is a secondary adapter for the AccountRepository port.
// It implements persistence using PostgreSQL.
export class PostgresAccountRepository implements AccountRepository {
    constructor(private readonly knex: Knex) {}

    public async findOne(id: AccountId): Promise<Account> {
        const row = await this.knex<AccountModel>('account')
            .select('id', 'held_by','balance', 'overdraft_limit', 'account_status')
            .where('id', '=', id.value)
            .first<AccountModel>();
        
        if (!row) {
            throw new NoSuchAccountError(id);
        }

        return AccountRowMapper.rowToDomain(row);
    }

    public async save(account: Account): Promise<void> {
        const row = AccountRowMapper.domainToRow(account);

        // Note: lost update can happen here.
        // Real world application would either use pessimistic or
        // optimistic concurrency control here.
        await this.knex<AccountModel>('account')
            .insert(row)
            .onConflict('id')
            .merge();
    }

    public async saveAll(accounts: Account[]): Promise<void> {
        const rows = accounts.map(account => AccountRowMapper.domainToRow(account));

        // Note: lost update can happen here.
        // Real world application would either use pessimistic or
        // optimistic concurrency control here.
        await this.knex<AccountModel>('account')
            .insert(rows)
            .onConflict('id')
            .merge();
    }
}