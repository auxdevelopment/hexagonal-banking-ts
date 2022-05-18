import express, { Express } from 'express';
import bodyParser from "body-parser";
import { Controller } from "./controller";

export class ExpressServer {
    private readonly server: Express;

    constructor(
        readonly controllers: Controller[]
    ) {
        this.server = express();
        this.server.use(bodyParser.json());

        controllers.forEach(controller => {
            controller.register(this.server);
        });
    }

    listen(port: number, onListen: Function): void {
        this.server.listen(port, () => onListen());
    }
}