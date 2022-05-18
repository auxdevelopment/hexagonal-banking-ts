import { IllegalValueError } from "../illegal-value.error";

// Balance is a value object.
// It represents an account balance at a certain point in time.
export class Balance {
    constructor(public readonly value: number) {
        if (value === null || value === undefined) {
            throw new IllegalValueError('value must not be null or undefined');
        }
    }

    // initial is a factory method that returns
    // an initial balance.
    public static initial(): Balance {
        return new Balance(0);
    }

    // debitFrom debits a given amount from the account balance.
    public debitFrom(amount: number): Balance {
        const newAmount = this.value - amount;

        return new Balance(newAmount);
    }

    // debitTo debits a given amount to the account balance.
    public debitTo(amount: number): Balance {
        const newAmount = this.value + amount;

        return new Balance(newAmount);
    }
}