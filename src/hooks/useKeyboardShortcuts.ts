import { useEffect, useState } from 'react'
import { initMakeRequest } from 'unsplash-js/dist/helpers/request'

const keyboardTabTable = {
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    '0': 9,
    '!': 10,
    '@': 11,
    '#': 12,
    $: 13,
    '%': 14,
    '^': 15,
    '&': 16,
    '*': 17,
    '(': 18,
    ')': 19,
}

// sets altHeld to true when held, but sets it to false when any key is let go
export function useAltKeyHeld(keyDownCallback: () => void, keyUpCallback: () => void) {
    const [altHeld, setAltHeld] = useState(false)
    function keyDownWrapper(e: KeyboardEvent) {
        if (e.altKey) {
            keyDownCallback()
            setAltHeld(true)
        }
    }
    function keyUpWrapper(e: KeyboardEvent) {
        setAltHeld(false)
        keyUpCallback()
    }
    useEffect(() => {
        window.addEventListener('keydown', keyDownWrapper)
        window.addEventListener('keyup', keyUpWrapper)
        return () => {
            window.removeEventListener('keydown', keyDownWrapper)
            window.removeEventListener('keyup', keyUpWrapper)
        }
    }, [])
    return altHeld
}

type NumberCallbacks = Record<number, () => void>

export function useKeyboardNumbers(numberCbObj: NumberCallbacks) {
    Object.entries(numberCbObj).map((obj, index) => {
        const [num, cb] = obj
        useKeyListener(String(num), cb)
    })
}

export function useUpVimNavigation(props: {
    upCallback: () => void
    max: number
    repeatDebounce: number
}) {
    return
}
export function useDownVimNavigation(props: {
    downCallback: () => void
    max: number
    initialValue: number
    repeatDebounce: number
}) {
    const [keyHeld, setKeyHeld] = useState(false)
    const [currValue, setCurrValue] = useState(props.initialValue)
    let timer: NodeJS.Timer

    function keyDownWrapper(e: KeyboardEvent) {
        clearInterval(timer)
        function keyDown() {
            console.log('keyDown')
            if (e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'arrowdown') {
                if (currValue + 1 >= props.max) return
                props.downCallback()
                setKeyHeld(true)
            }
        }
        keyDown()
        timer = setInterval(keyDown, props.repeatDebounce)
    }

    function resetKeyHeld(e: KeyboardEvent) {
        setKeyHeld(false)
    }

    useEffect(() => {
        window.addEventListener('keydown', keyDownWrapper)
        window.addEventListener('keyup', resetKeyHeld)
        return () => {
            window.removeEventListener('keydown', keyDownWrapper)
            window.removeEventListener('keyup', resetKeyHeld)
        }
    }, [])
    return keyHeld
}
export function useLeftVimNavigation(props: {
    leftCallback: () => void
    max: number
    repeatDebounce: number
}) {
    return
}
export function useRightVimNavigation(props: {
    rightCallback: () => void
    max: number
    repeatDebounce: number
}) {
    return
}

// sets keyHeld to true when held, but sets it to false when any key is let go
export function useKeyHeldListener(
    key: string,
    keyDownCallback: () => void,
    keyUpCallback: () => void,
    repeatDebounce: number = 200,
) {
    const [keyHeld, setKeyHeld] = useState(false)
    let timer: NodeJS.Timer

    function keyDownWrapper(e: KeyboardEvent) {
        clearInterval(timer)
        function keyDown() {
            console.log('keyDown')
            if (e.key.toLowerCase() === key) {
                keyDownCallback()
                setKeyHeld(true)
            }
        }
        keyDown()
        timer = setInterval(keyDown, repeatDebounce)
    }
    function keyUpWrapper(e: KeyboardEvent) {
        setKeyHeld(false)
        keyUpCallback()
        clearInterval(timer)
    }
    useEffect(() => {
        window.addEventListener('keydown', keyDownWrapper)
        window.addEventListener('keyup', keyUpWrapper)
        return () => {
            window.removeEventListener('keydown', keyDownWrapper)
            window.removeEventListener('keyup', keyUpWrapper)
        }
    }, [])
    return keyHeld
}
export function useAllKeyListener(callback: () => void) {}

export function useKeyUpListener(key: string | string[], callback: () => void) {
    function callbackWrapper(e: KeyboardEvent) {
        if (typeof key === 'string') {
            if (e.key === key) callback()
            return
        }
        key.map((k) => {
            if (e.key === k) {
                callback()
                return
            }
        })
        return
    }
    useEffect(() => {
        window.addEventListener('keyup', callbackWrapper)
        return () => {
            window.removeEventListener('keyup', callbackWrapper)
        }
    }, [])
}
export function useKeyListenerNew(key: string | string[], callback: (e: KeyboardEvent) => void) {
    console.log('usekeylistenernew caled')
    function callbackWrapper(e: KeyboardEvent) {
        // console.log('cb wrapper called for: ' + key)
        // console.log(`${e.key} hit`)
        if (typeof key === 'string') {
            if (e.key === key) callback(e)
            return
        }
        key.map((k) => {
            if (e.key === k) {
                callback(e)
                return
            }
        })
        return
    }
    const down = () => window.addEventListener('keydown', callbackWrapper)
    const cleanUp = () => window.removeEventListener('keydown', callbackWrapper)
    return [down, cleanUp]
}

export function useKeyListener(key: string | string[], callback: (e: KeyboardEvent) => void) {
    function callbackWrapper(e: KeyboardEvent) {
        if (typeof key === 'string') {
            if (e.key === key) callback(e)
            return
        }
        key.map((k) => {
            if (e.key === k) {
                callback(e)
                return
            }
        })
        return
    }
    useEffect(() => {
        window.addEventListener('keydown', callbackWrapper)
        return () => {
            window.removeEventListener('keydown', callbackWrapper)
        }
    }, [])
}

export function useKeyListenerWithCondition(
    key: string | string[],
    condition: boolean,
    callback: () => void,
) {
    function callbackWrapper(e: KeyboardEvent) {
        if (typeof key === 'string') {
            if (e.key === key && condition) {
                callback()
            }
            return
        }
        key.map((k) => {
            if (e.key === k && condition) {
                callback()
                return
            }
        })
        return
    }
    useEffect(() => {
        window.addEventListener('keydown', callbackWrapper)
        return () => {
            window.removeEventListener('keydown', callbackWrapper)
        }
    }, [])
}

export function useKeyboardShortcuts(callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        window.addEventListener('keydown', callback)
        return () => window.removeEventListener('keydown', callback)
    }, [])
    return
}

export function useKeyHeld() {}

export default useKeyboardShortcuts
