import { waitUntil } from "../lib/utils/wait";

//TODO: all lof this should be moved to other files, this is just a temporay place
const init = async () => {
    await Promise.all([
        // page.goto("https://dev.realtimeboard.com?clientHost=192.168.114.154&clientPort=8080&serverName=10.10.0.202"),
        page.goto("https://miro.com"),
        page.waitForNavigation({ waitUntil: 'load' })
    ]);
    await page.evaluate(() => {
        localStorage.setItem('show-grid', 'false')
        localStorage.setItem('mini-map-visible', 'false')
        localStorage.setItem('rtb-recent-announce', new Date().getTime().toString())
        localStorage.setItem('template_picker_auto_show_setting', 'false')
    })
}

const login = async (email: string, password: string) => {
    // await page.goto("https://dev.realtimeboard.com/login", {waitUntil: 'load'})
    await page.goto("https://miro.com/login", {waitUntil: 'load'})
    await page.fill('[data-autotest-id="mr-form-login-email-1"]', email)
    await page.fill('[data-autotest-id="mr-form-login-password-1"]', password)

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.click('[data-autotest-id="mr-form-login-btn-signin-1"]'),
    ]);
}

const createBoard = async () => {
    await page.click('[data-autotest-id="dashboardTemplatesPanel__createNewBoard"]')
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load', url: /.*\/app\/board\/.*/ }),
        page.click('.rtb-modal .rtb-btn')
    ])
}

const waitUntilBoardLoaded = async () => {
    const timeout = 30000
    await Promise.all([
        waitUntil(async () => {
            // @ts-ignore
            const result = await page.evaluate(() => { return window.cmd != undefined; })
            return result
        }, { timeout: timeout, msg: 'window.cmd is not loaded' }),
        waitUntil(async () => {
            // @ts-ignore
            const result = await page.evaluate(() => { return window.miro != undefined; })
            return result
        }, { timeout: timeout, msg: 'window.miro is not loaded' }),
        waitUntil(async () => {
            // @ts-ignore
            const result = await page.evaluate(() => { return window.reloadSandbox != undefined; })
            return result
        }, { timeout: timeout, msg: 'window.reloadSandbox is not loaded' }),
        waitUntil(async () => {
            // @ts-ignore
            const result = await page.evaluate(() => { return window.__unloadAllOnDemandPlugins != undefined; })
            return result
        }, { timeout: timeout, msg: 'window.__unloadAllOnDemandPlugins is not loaded' }),
        waitUntil(async () => {
            // @ts-ignore
            const result = await page.evaluate(() => { return window.__loadPluginOnDemand != undefined; })
            return result
        }, { timeout: timeout, msg: 'window.__loadPluginOnDemand is not loaded' })
    ])
}

export { init, login, createBoard, waitUntilBoardLoaded }