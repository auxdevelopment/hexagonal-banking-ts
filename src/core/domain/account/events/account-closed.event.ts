import { AccountHolderId } from "../../account-holder/account-holder.aggregate";
import { DomainEvent } from "../../domain-event.base";
import { AccountId } from "../account-id.value";

export class AccountClosedEvent extends DomainEvent {
    constructor(public accountId: AccountId, public accountHolderId: AccountHolderId) {
        super();
    }
}