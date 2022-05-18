import { randomUUID } from 'crypto';

export abstract class DomainEvent {
    public readonly id: string;

    constructor() {
        this.id = randomUUID();
    }
}