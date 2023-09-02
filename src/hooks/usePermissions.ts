import { useEffect, useState } from 'react'

type PermissionCategory = 'tabs' | 'bookmarks' | 'history'

export default function usePermissions(permission: PermissionCategory) {
    const [permissionGranted, setPermissionGranted] = useState(false)
    // console.log('usePermissions called')

    useEffect(() => {
        if (!permissionGranted) {
            ;(async () => {
                const tabs = (await chrome.tabs.query({
                    currentWindow: true,
                })) as chrome.tabs.Tab[]
                console.log(tabs)
            })()
        }
    }, [])

    function requestPermission() {
        chrome.permissions
            .request({ permissions: [permission], origins: ['https://*/*'] })
            .then((requestGranted) => requestGranted && setPermissionGranted(true))
    }

    useEffect(() => {
        chrome.permissions
            .contains({
                permissions: [permission],
            })
            .then((isGranted) => {
                isGranted && setPermissionGranted(true)
            })
    }, [])

    return { permissionGranted, requestPermission }
}
