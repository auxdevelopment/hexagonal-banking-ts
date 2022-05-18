import { AccountHolderId } from "../account-holder/account-holder.aggregate";
import { AccountId } from "./account-id.value";
import { AccountStatus } from "./account-status";
import { Account, OverdraftLimitExceededError } from "./account.aggregate";
import { Balance } from "./balance.value";

it('should debit to account', () => {
    const account = new Account(
        new AccountId('123'),
        new AccountHolderId('123'),
        Balance.initial(),
        0,
        AccountStatus.OPEN,
    );

    account.debitTo(100);

    expect(account.currentBalance().value).toBe(100);
});

it('should debit from account', () => {
    const account = new Account(
        new AccountId('123'),
        new AccountHolderId('123'),
        Balance.initial(),
        100,
        AccountStatus.OPEN,
    );

    account.debitFrom(100);

    expect(account.currentBalance().value).toBe(-100);
});

it('should not debit from account when violating overdraft limit', () => {
    const account = new Account(
        new AccountId('123'),
        new AccountHolderId('123'),
        Balance.initial(),
        100,
        AccountStatus.OPEN,
    );

    expect(() => {
        account.debitFrom(1000);
    }).toThrowError(new OverdraftLimitExceededError('Overdraft limit of 100 would be exceeded.'));
});