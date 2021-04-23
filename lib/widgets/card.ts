import { sdk } from "../utils/sdk";
import Widget from "./widget";

const linkButton = {
    top: 20,
    width: 15,
    height: 15,
}

export default class Card extends Widget {

    public async getLinkButtonCenter() {
        const rect = await this.getRectangle()
        const scale = await sdk.getViewportScale()
        return {
            x: rect.x + rect.width - (linkButton.width * scale / 2),
            y: rect.y + (linkButton.top * scale) + (linkButton.height * scale / 2)
        }
    }
}