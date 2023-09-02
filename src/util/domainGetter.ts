const doubleTLDs = ['co', 'com', 'org', 'net', 'au']

export function domainGetter(url: string) {
    const subDirectory = ''
    let tld = ''

    const urlSplit = url.split('.')
    console.log('urlsplit is: ' + urlSplit)
    if (urlSplit.length === 1) return [urlSplit[0], null]
    if (urlSplit.length === 2) return urlSplit

    let temp = url

    const protocol = url.split('://')[1]
    if (protocol) {
        temp = protocol
    }

    const www = temp.split('www.')[1]
    if (www) {
        temp = www
    }

    const parts = temp.split('.')

    tld = parts.slice(1).join('')
    let domain = parts[parts.length - 2]

    const res = doubleTLDs.map((tld) => {
        if (domain === tld) {
            tld = parts.slice(1).join('.')
            domain = parts[parts.length - 3]
            return [domain, tld]
        }
    })

    if (res[0]) {
        return res[0]
    }

    return [domain, tld]
}

export function subDirectoryGetter(url: string) {
    let temp = url
    const protocol = url.split('://')[1]
    if (protocol) {
        temp = protocol
    }
    const slashIndex = temp.indexOf('/')
    if (slashIndex === -1) return false
    return protocol.slice(slashIndex)
}

export default domainGetter
