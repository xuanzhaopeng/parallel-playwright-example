export default interface WidgetData {
    id: string
    type: string,
    text?: string,
    bounds: {
        top: number,
        left: number,
        height: number,
        width: number
    }
}