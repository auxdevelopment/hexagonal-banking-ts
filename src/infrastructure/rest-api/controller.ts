import { Express } from 'express';

export interface Controller {
    register(server: Express): void;
}