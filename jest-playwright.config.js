module.exports = {
    browsers: ["chromium"],
    launchOptions: {
        headless: true
    },
    contextOptions: {
        ignoreHTTPSErrors: true
    },
    connectOptions: {
        slowMo: 0
    },
    miro: {
        baseUrl: "https://miro.com",
        privateAPI: "http://10.149.248.166:9110",
        animationChangesCheck: {
            count: 5,
            interval: 200,
            timeout: 5000
        },
        env: {
        }
    }
}