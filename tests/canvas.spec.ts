import Card from "../lib/widgets/card";
import services from "../lib/services"
import { sdk } from "../lib/utils/sdk";
import { waitUntil } from "../lib/utils/wait";

describe('Kanban widget', () => {
    let user1Email = 'zhaopeng+user1@miro.com',
        password: string = process.env.PASSWORD || '';

    const init = async () => {
        await page.goto("https://miro.com/", {waitUntil: 'networkidle'}),
        await page.evaluate(() => {
            localStorage.setItem('show-grid', 'false')
            localStorage.setItem('mini-map-visible', 'false')
            localStorage.setItem('rtb-recent-announce', new Date().getTime().toString())
            localStorage.setItem('template_picker_auto_show_setting', 'false')
        })
    }

    const login = async (email: string, password: string) => {
        await page.goto("https://miro.com/login", { waitUntil: 'networkidle' }),
        await page.fill('[data-autotest-id="mr-form-login-email-1"]', email, {})
        await page.fill('[data-autotest-id="mr-form-login-password-1"]', password)
        await page.click('[data-autotest-id="mr-form-login-btn-signin-1"]')
    }

    const createBoard = async () => {
        await page.click('[data-autotest-id="dashboardTemplatesPanel__createNewBoard"]')
        await page.click('.rtb-modal .rtb-btn')
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

    test('should keep the link within the card when duplicate the kanban', async () => {
        const link = 'http://example.com/'
        let screenCenter = await sdk.getViewportCenter()

        await page.click('.AT__toolbar--LIBRARY')
        await page.click('.AT__library--KANBAN')
        await page.mouse.click(screenCenter.width, screenCenter.height)

        const kanban = await services.widgets.getWidget(0, 'KANBAN')
        const card = await services.widgets.getWidget(0, 'CARD')    
        await sdk.clearCanvasSelection()
        const kanbanRectangle = await kanban.getRectangle()
        const cardCenter = await card.getCenter()

        await page.mouse.click(cardCenter.x,  cardCenter.y, {clickCount: 1, delay: 200})
        await page.keyboard.press('Control+k');
        await page.fill('[placeholder="Paste link"]', link)
        await page.click('[data-autotest-id="modal-window__submit-button"]')

        await page.mouse.click(kanbanRectangle.x + 1, kanbanRectangle.y + 1)
        await page.keyboard.press('Control+d');
        
        const copiedKanban = await services.widgets.getWidget(1, 'KANBAN')
        const copiedCard = (await services.widgets.getWidget(1, 'CARD')) as Card
        await services.widgets.waitUntilWigetsUpdated([copiedKanban, copiedCard])

        await copiedKanban.zoomTo()

        await services.widgets.waitUntilWigetsUpdated([copiedKanban, copiedCard])

        const linkButtonRect = await copiedCard.getLinkButtonCenter()
        await page.mouse.click(linkButtonRect.x, linkButtonRect.y)
        await waitUntil(async () => context.pages().length == 2, {msg: "It should have 2 opened pages"})

        await expect(context.pages()[1]).toEqualUrl(link);
    })
})