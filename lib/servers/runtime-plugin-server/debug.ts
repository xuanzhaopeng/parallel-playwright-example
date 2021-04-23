import PluginServer from ".";

let server = new PluginServer()
server.start( new URL("https://dev.realtimeboard.com/app/static/sdk.1.1.js") )