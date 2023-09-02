export default function useColor() {
    // const isDark = !(document.documentElement.getAttribute('data-theme') === 'dark')
    // const [darkMode] = useState(isDark)
    // toggle()
    return { toggle, setValue, setValues, getValue, getValues, setdefaultVars }
}

function setdefaultVars(bg: string = 'pink', color: string = 'forestgreen', radius: number = 6) {
    console.log('set default vars called')
    document.documentElement.style.setProperty('--bg', bg)
    document.documentElement.style.setProperty('--color', color)
    document.documentElement.style.setProperty('--radius', radius + 'px')
}

export function toggle(isDarkMode: boolean) {
    console.log('toggle called')
    // const darkMode = !(document.documentElement.getAttribute('data-theme') === 'dark')

    toggleValues()
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', '')
        // setValue('--radius', '6px')
    } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        // setValue('--radius', '0px')
    }
}

// TODO
function getFromLocalStorage() {
    throw 'TO BE IMPLEMENTED - getFromLocalStorage'
}

// TODO
function setLocalStorage() {
    throw 'TO BE IMPLEMENTED - setFromLocalStorage'
}

export function toggleValues(values?: toggleTypes[]) {
    console.log('toggleValues')
    if (!values) {
        const bgTemp = getValue('--bg')
        setValue('--bg', getValue('--color'))
        setValue('--color', bgTemp)
    } else {
        values.map((value) => {
            if (value === '--bg' || value === '--color') {
                const bgTemp = getValue('--bg')
                setValue('--bg', getValue('--color'))
                setValue('--color', bgTemp)
            }
        })
    }
}

function getValue(value: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(value)
}

function getValues(values: string[]) {
    const arr: string[] = []
    values.map((value) => {
        arr.push(getValue(value))
    })
    return arr
}

function setValue(key: string, value: string) {
    document.documentElement.style.setProperty(key, value)
}

function setValues(params: { key: string; value: string }[]) {
    params.map((param) => {
        setValue(param.key, param.value)
    })
}

type toggleTypes = '--bg' | '--color'
