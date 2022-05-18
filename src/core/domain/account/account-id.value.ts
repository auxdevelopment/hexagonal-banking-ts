import { IllegalValueError } from "../illegal-value.error";

// AccountId is a value object.
export class AccountId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new IllegalValueError('AccountHolderId must not be empty')
        }

        // perform sophisticated validation logic ...
    }
}
