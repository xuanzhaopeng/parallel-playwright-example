import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import RuntimePluginServer from '../servers/runtime-plugin-server';
import { EnvService } from './env.service';
import MockPluginServer from '../servers/mock-plugin-server';

export interface PluginCreationOptions {
    onReady: boolean
    content: () => void
    variables: { [key: string]: unknown }
}

export class PluginService {
    private static instance: PluginService
    private serverUrl: string | undefined
    private runtimePluginServer: RuntimePluginServer
    private mockPluginServer:  MockPluginServer
    private env: EnvService

    public static get(env: EnvService) {
        if(!this.instance) {
            this.instance = new PluginService(env)
        }
        return this.instance;
    }

    private constructor(env: EnvService) {
        this.env = env;
        this.runtimePluginServer = new RuntimePluginServer()
        this.mockPluginServer = new MockPluginServer()
    }

    public startMockServer() {
        this.mockPluginServer.start()
    }

    public stopMockServer() {
        this.mockPluginServer.stop()
    }

    public startRuntimeServer(sdkUrlStr: string, port:number = 0) {
        const sdkUrl = new URL(sdkUrlStr, this.env.getConfig().baseUrl)
        this.serverUrl = this.runtimePluginServer.start(sdkUrl, port)
    }

    public stopRuntimeServer() {
        this.runtimePluginServer.stop()
    }

    public async createRuntimePlugin(options: PluginCreationOptions) {
        if (!this.serverUrl) {
            throw new Error('Cannot create plugin because the plugin mocked server is not started');
        }
        const hash = 'e2etest' + crypto.randomBytes(20).toString('hex')
        const fileName = path.join(os.tmpdir(), hash)
        const scope = JSON.stringify(options.variables)
        const content = options.content.toString()

        let fileContent = `;Object.assign(window, ${scope});`
        if (options.onReady) {
            fileContent += `;miro.onReady(${content});`
        } else {
            fileContent += content
        }

        // to detect the plugin execution
        fileContent += `;miro.onReady( ()=>{ window.parent.postMessage("${hash}", "*") });`
        await fs.promises.writeFile(fileName, fileContent)
        return {
            hash,
            url: this.serverUrl + '/' + hash,
        }
    }
}