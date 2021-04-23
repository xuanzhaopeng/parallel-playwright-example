const waitByTime = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const waitUntil = async (predicate: () => Promise<any>, options?: { timeout?: number, interval?: number, msg?: string }) => {
    let r = undefined,
        interval = options?.interval || 500,
        timeout = options?.timeout || 30000,
        start = new Date().getTime()
    do {
        try {
            r = await predicate()
            if (r != null && r != undefined && r !== false) {
                if (Array.isArray(r) && r.length > 0) {
                    return r
                }
                if (!Array.isArray(r)) {
                    return r
                }
            }
            await waitByTime(interval)
        } catch {
            await waitByTime(interval)
        }

    } while (new Date().getTime() - start < timeout)
    throw new Error(`Wait timed out after ${timeout}ms. ${options?.msg || ''}`)
}

const waitUntilNoChange = async (action: () => Promise<any>, minCheck: number, options?: { timeout?: number, interval?: number, msg?: string }) => {
    let currentState = await action(),
        interval = options?.interval || 500,
        timeout = options?.timeout || 30000,
        start = new Date().getTime(),
        countOfMatch = 0
    do {
        try{
            const newState = await action()
            if (JSON.stringify(currentState) == JSON.stringify(newState)) {
                countOfMatch += 1
            } else {
                countOfMatch = 0
                currentState = newState
            }
            if (countOfMatch >= minCheck) {
                return true
            }
            await waitByTime(interval)
        } catch {
            console.log('error!!!!!!!!!')
            await waitByTime(interval)
        }
    } while (new Date().getTime() - start < timeout)
    throw new Error(`Wait until no changed timed out after ${timeout}ms. ${options?.msg || ''}`)
}

const waitUntilEqual = async (predicate: () => Promise<any>, expectValue: any, options?: { timeout?: number, interval?: number, msg?: string }) => {
    let r = undefined,
        interval = options?.interval || 500,
        timeout = options?.timeout || 30000,
        start = new Date().getTime()
    do {
        try {
            r = await predicate()
            if(r == expectValue) {
                return true
            }
            await waitByTime(interval)
        } catch {
            await waitByTime(interval)
        }

    } while (new Date().getTime() - start < timeout)
    throw new Error(`Wait until equal timed out after ${timeout}ms. expect: ${expectValue},  but: ${r}  ${options?.msg || ''}`)
}

export {
    waitByTime,
    waitUntil,
    waitUntilEqual,
    waitUntilNoChange
}