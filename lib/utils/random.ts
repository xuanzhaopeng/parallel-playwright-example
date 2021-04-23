const randomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9)
}

const random = {
    randomId
}

export default random

