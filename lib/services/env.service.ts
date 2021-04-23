import * as path from 'path'


export interface MiroConfig {
    baseUrl: string,
    animationChangesCheck: {
        count: number,
        interval: number,
        timeout: number
    },
    privateAPI: string,
    env: {}
}

export class EnvService {
    private static instance: EnvService;
    private config: MiroConfig = {
        baseUrl: '',
        animationChangesCheck: {
            count: 5,
            interval: 200,
            timeout: 5000
        },
        privateAPI: '',
        env: {}
    }

    public static get() {
        if(!this.instance) {
            this.instance = new EnvService()
        }
        return this.instance
    }

    private constructor() {
        const loadedConfig = require(path.join(__dirname, '../../jest-playwright.config.js'))
        if(loadedConfig.miro) {
            this.config = loadedConfig.miro;
        }
    }

    public getConfig():MiroConfig {
        return this.config
    }
}