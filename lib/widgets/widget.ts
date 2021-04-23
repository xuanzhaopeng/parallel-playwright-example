import services from "../../lib/services";
import { sdk } from "../../lib/utils/sdk";
import { waitUntilNoChange } from "../../lib/utils/wait";
import WidgetData from "../../lib/widgets/widgetData";

export default abstract class Widget {
    public widgetData: WidgetData;
    public constructor(widgetData: WidgetData) {
        this.widgetData = widgetData
    }

    public async getRectangle(): Promise<{x: number, y: number, height: number, width: number}> {
        const cord0 = await page.evaluate(async () => {
            // @ts-ignore
            const viewport0 = await miro.board.viewport.get()
            return {
                x: viewport0.x,
                y: viewport0.y
            }
        })

        const cord1 = {
            x: this.widgetData.bounds.left,
            y: this.widgetData.bounds.top
        }

        // @ts-ignore
        const scale = await sdk.getViewportScale()
        return {
            x: (cord1.x - cord0.x) * scale,
            y: (cord1.y - cord0.y) * scale,
            height: this.widgetData.bounds.height * scale,
            width: this.widgetData.bounds.width * scale
        } 
    }

    public async getCenter(): Promise<{x: number, y: number}> {
        const rectangle = await this.getRectangle()
        return {
            x: rectangle.x + rectangle.width / 2,
            y: rectangle.y + rectangle.height / 2,
        }
    }

    public async waitUntilViewUpdated(): Promise<void> {
        await waitUntilNoChange(
            async () => {
                return await this.getRectangle()
            }, 
            services.env.getConfig().animationChangesCheck.count, 
            {
                interval: services.env.getConfig().animationChangesCheck.interval,  
                timeout: services.env.getConfig().animationChangesCheck.timeout
            })
    }

    public async zoomTo() {
        await sdk.zoomWidgetToViewport(this.widgetData)
    }
}