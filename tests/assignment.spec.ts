import { percySnapshot } from "percy-playwright";
import { sdk } from "../lib/utils/sdk";
import { waitUntil, waitUntilEqual } from "../lib/utils/wait";

describe('Sticker', () => {
    let user1Email = 'zhaopeng+user1@miro.com',
        user2Email = 'zhaopeng+user2@miro.com',
        password: string = process.env.PASSWORD || '';

    const init = async () => {
        await page.goto("https://miro.com/", { waitUntil: 'load' }),
        await page.evaluate(() => {
            localStorage.setItem('show-grid', 'false')
            localStorage.setItem('mini-map-visible', 'false')
            localStorage.setItem('rtb-recent-announce', new Date().getTime().toString())
            localStorage.setItem('template_picker_auto_show_setting', 'false')
        })
    }

    const login = async (email: string, password: string) => {
        await page.goto("https://miro.com/login", {waitUntil: 'load'})
        await page.fill('[data-autotest-id="mr-form-login-email-1"]', email, {})
        await page.fill('[data-autotest-id="mr-form-login-password-1"]', password)
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('[data-autotest-id="mr-form-login-btn-signin-1"]'),
        ]);
    }

    const createBoard = async () => {
        await page.click('[data-autotest-id="dashboardTemplatesPanel__createNewBoard"]')
        await page.click('.rtb-modal .rtb-btn')
    }

    const makeId = (length: number) => {
        let result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    }

    const waitUntilBoardLoaded = async () => {
        await waitUntil(async () => await page.evaluate(() => (window as any).cmd.board.api.isAllWidgetsLoaded()) == true)
        await waitUntil(async () => await page.evaluate(() => (window as any).miro) != undefined)
    }

    beforeEach(async () => {
        await init()
        await login(user1Email, password)
        await createBoard()
        await waitUntilBoardLoaded();
    })

    test('should be created and visible for person who has been invited to the board', async () => {
        let boardName = 'my test board' + makeId(5)
        let screenCenter = await sdk.getViewportCenter()

        await page.click('[data-plugin-id="STICKERS"]')
        await page.mouse.click(screenCenter.width, screenCenter.height)
        await waitUntil(async () => await page.evaluate(async () => {
            let r = await (window as any).miro.board.getAllObjects()
            return r.length
        }) == 1)
        await page.keyboard.type("hello world")
        await percySnapshot(page, `test1-user1`)
        await page.click('[data-autotest-id="board__share-button--desktop"]')
        await page.fill('[data-autotest-id="rename-board-modal__name-input"]', boardName)
        await page.click('[data-autotest-id="rename-board-modal__submit-button"]')
        await page.waitForSelector('[data-auto-test-id="shareMdEmailsEditorInput"]', {
            state: "visible"
        })
        await page.waitForSelector('.email-input__input')
        await page.click('[data-auto-test-id="shareMdEmailsEditorInput"]')
        await page.keyboard.type(user2Email)
        await page.keyboard.press('Enter')
        await page.click('[data-auto-test-id="shareMdButtonSend"]')
        let boardUrl = page.url()
        await jestPlaywright.resetPage()
        await login(user2Email, password)

        await Promise.all([
            page.waitForNavigation({waitUntil: 'load'}),
            page.click(`text="${boardName}"`)
        ])
        
        await waitUntilEqual(async () => page.url(), boardUrl, {msg: 'The board url is not '})

        await waitUntilBoardLoaded()
        let wigets = await page.evaluate(async () => {
            let r = await (window as any).miro.board.getAllObjects()
            return r
        })
        expect(wigets).toHaveLength(1);
        await percySnapshot(page, `test1-user2`)
    });
});