import { DomainEvent } from "./domain-event.base";

// Represents an abstract base class for all aggregate roots.
// An aggregate root is a cluster of related domain objects
// that act as one cohesive and consistent unit.
//
// Aggregates can only reference other aggregates by ID - never by reference.
//
// Aggregates manage a set of domain events that will be transactionally published
// by a repository.
export abstract class AggregateRoot<T> {
    private events: Array<DomainEvent>;

    constructor(public readonly id: T) {
        this.events = new Array<DomainEvent>();
    }

    protected publish(event: DomainEvent) {
        this.events.push(event);
    }
}