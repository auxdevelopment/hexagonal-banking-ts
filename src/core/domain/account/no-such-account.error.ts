import { AccountId } from "./account-id.value";

export class NoSuchAccountError extends Error {
    constructor(id: AccountId) {
        super(`Account with ID ${id.value} does not exist`);
    }
}