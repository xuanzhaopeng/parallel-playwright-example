import User from "../model/user";
import got from "got"
import { EnvService, MiroConfig } from "./env.service";
import privateAPI from "../api/private-api";

export class UserService {
    private static instance: UserService
    private config: MiroConfig

    public static get(env: EnvService) {
        if (!this.instance) {
            this.instance = new UserService(env)
        }
        return this.instance;
    }

    private constructor(env: EnvService) {
        this.config = env.getConfig();
    }

    public async createUser(): Promise<any> {
        const {body} = await got.post(this.config.privateAPI + privateAPI.registration, {
            json: {
                name: 'world',
                email: '',
                password: '',
                ip: '',
                userAgent: '',
                fromSocialNetwork: 'true'
            },
            responseType: 'json'
        })
        return body
    }
}