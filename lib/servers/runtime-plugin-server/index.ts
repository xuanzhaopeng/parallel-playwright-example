import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import * as net from 'net'
import * as os from 'os'

const server_options = {
    key: fs.readFileSync(path.join(__dirname, './key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './cert.pem')),
}

export default class PluginServer {
    private server: https.Server | undefined

    public start(sdkUrl: URL, port: number = 0): string {
        if (!this.server) {
            this.server = this.createServer(sdkUrl, port)
        }
        let serverUrl = 'https://127.0.0.1:' + (this.server.address() as net.AddressInfo)?.port

        console.log(`Plugin Serve start: ${serverUrl}`)
        return serverUrl
    }

    public stop() {
        if (this.server) {
            this.server.close()
            this.server = undefined
            console.log('Plugin Serve stopped')
        }
    }

    private createServer(sdkUrl: URL, port: number): https.Server {
        const pageTemplate = `<!DOCTYPE html><html>
                  <head><script src="${sdkUrl}"></script></head>
                  <body>{html}<script>{js}</script></body>
                </html>`
    
        const extensionPointTemplate = '<h1>Extension point</h1>'
    
        const newServer = https.createServer(server_options, function (request, response) {
            // for extension points testing
            if (request.url === '/frame') {
                const content = pageTemplate.replace('{js}', '').replace('{html}', extensionPointTemplate)
                response.end(content, 'utf-8')
                return
            }
    
            // for plugin testing
            const hash = request?.url?.substr(1)
    
            // only accept simple strings
            if ((!hash && !hash?.startsWith('e2etest')) || !hash?.match(/^\w*$/)) {
                response.writeHead(500, {'Content-Type': 'text/html'})
                response.end('', 'utf-8')
                return
            }
    
            const tmpFile = path.join(os.tmpdir(), hash)
    
            fs.readFile(tmpFile, function (error, fileContent) {
                if (error) {
                    response.writeHead(404, {'Content-Type': 'text/html'})
                    response.end('', 'utf-8')
                } else {
                    response.writeHead(200, {'Content-Type': 'text/html'})
                    const content = pageTemplate.replace('{js}', fileContent.toString()).replace('{html}', '')
                    response.end(content, 'utf-8')
                }
            })
        })
        newServer.listen(port)
        return newServer
    }
}

