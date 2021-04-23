import WidgetData from "../widgets/widgetData"

const clearCanvasSelection = async () => {
    // @ts-ignore
    await page.evaluate(() => cmd.board.api.clearSelection())
}

const fitAllWigetsToScreen = async () => {
    // @ts-ignore
    await page.evaluate(() => cmd.board.api.showAll())
    // bypass the animiation
    await page.waitForTimeout(500)
    // @ts-ignore
    await page.evaluate(() => cmd.board.api.showAll())
}

const getViewportScale = async (): Promise<number> => {
    // @ts-ignore
    return await page.evaluate(async () => await miro.board.viewport.getScale())
}

const zoomWidgetToViewport = async (widget: WidgetData) => {
    let viewport = {
        x: widget.bounds.left,
        y: widget.bounds.top,
        width: widget.bounds.width,
        height: widget.bounds.height
    }
    let canvasSize = await page.evaluate(() => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    })
    let offset = {
        left:  90,
        top: 90,
        right: 90,
        bottom: 90,
    }

    let viewWidth = canvasSize.width - offset.left - offset.right
    let viewHeight = canvasSize.height - offset.top - offset.bottom
    
    let widthScale = viewWidth / viewport.width
    let heightScale = viewHeight / viewport.height
    let offsetLeft = offset.left / widthScale
    let offsetRight = offset.right / widthScale
    let offsetTop = offset.top / heightScale
    let offsetBottom = offset.bottom / heightScale

    viewport.x -= offsetLeft
    viewport.y -= offsetTop
    viewport.width += offsetRight + offsetLeft
    viewport.height += offsetTop + offsetBottom
    
    // @ts-ignore
    await page.evaluate(async (v) => await miro.board.viewport.setViewport(v), viewport)
}

const getViewportCenter = async () => {
    let width = await page.evaluate(() => window.innerWidth),
        height = await page.evaluate(() => window.innerHeight);
    return {
        width: width / 2,
        height: height / 2
    }
}

const sdk = {
    clearCanvasSelection,
    fitAllWigetsToScreen,
    getViewportScale,
    getViewportCenter,
    zoomWidgetToViewport
}

export { sdk }