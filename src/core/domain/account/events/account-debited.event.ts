import { DomainEvent } from "../../domain-event.base";

export class AccountDebitedEvent extends DomainEvent {
    constructor(public amount: number) {
        super();
    }
}