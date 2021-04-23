import express from 'express';
import * as http from 'http'

export default class MockPluginServer {
    private app;
    private server: http.Server | undefined;

    public constructor() {
        this.app = express()
        this.app.use(express.static(__dirname + '/plugins'))
    }

    public start() {
        this.server = this.app.listen(9091, () => {
            console.log(`Mock plugin server start at http://localhost:${9091}`)
        })
    }

    public stop() {
        if(this.server !== undefined) {
            this.server.close()
            console.log(`Mock plugin server stopped at http://localhost:${9091}`)
        }
    }
}