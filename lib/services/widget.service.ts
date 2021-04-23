import Kanban from "../widgets/kanban";
import WidgetData from "../widgets/widgetData";
import Text from "../widgets/text";
import { waitUntil } from "../utils/wait";
import Widget from "../widgets/widget";
import Card from "../widgets/card";

export class WidgetService {
    private static instance: WidgetService

    public static get() {
        if (!this.instance) {
            this.instance = new WidgetService()
        }
        return this.instance;
    }

    private constructor() {

    }

    public async waitUntilWigetsUpdated(wigets: Widget[]) {
        await Promise.all(wigets.map((w) => w.waitUntilViewUpdated()))
    }

    public async waitUntilWigets(count: number): Promise<boolean> {
        try {
            return await waitUntil(async () => {
                let widgets = await page.evaluate(async () => {
                    return await (window as any).miro.board.getAllObjects()
                })
                if (widgets.length < count) {
                    return false
                } else {
                    return true;
                }
            }, { msg: `Try to get at least ${count} widgets,  but not found` })
        } catch (e) {
            return false
        }
    }

    public async getWidget(index: number = 0, type?: string) {
        const widgetData: WidgetData = await waitUntil(async () => {
            let widgets = await page.evaluate(async () => {
                return await (window as any).miro.board.getAllObjects()
            })
            if (type) {
                widgets = widgets?.filter((w: any) => w.type == type) || []
            }
            if (widgets.length < index + 1) {
                return undefined
            } else {
                return widgets[index];
            }
        }, { msg: `Try to get ${type || 'any'} widgets by index ${index},  but not found` })

        switch (widgetData.type) {
            case 'CARD':
                return new Card(widgetData)
            case 'KANBAN':
                return new Kanban(widgetData)
            case 'TEXT':
                return new Text(widgetData)
            default:
                throw new Error(`Cannot init widget ${widgetData.type}`)
        }
    }
}