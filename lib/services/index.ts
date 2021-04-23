import { EnvService } from "./env.service"
import { PluginService } from "./plugin.service"
import { UserService } from "./users.service";
import { WidgetService } from "./widget.service";

const env = EnvService.get();
const plugins = PluginService.get(env)
const widgets = WidgetService.get()
const users = UserService.get(env)

const services = {
    env,
    plugins,
    widgets,
    users
}

export default services