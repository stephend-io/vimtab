import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import usePermissions from '../../hooks/usePermissions'
import useTabs, { keyToTabArray } from '../../hooks/useTabs'
import { useAltKeyHeld, useKeyHeldListener, useKeyListener } from '../../hooks/useKeyboardShortcuts'

async function getActiveTabs() {
    const query = (await chrome.tabs.query({
        currentWindow: true,
    })) as chrome.tabs.Tab[]
    return query
}
async function getOtherTabs() {
    const query = (await chrome.tabs.query({
        currentWindow: false,
    })) as chrome.tabs.Tab[]
    return query
}
async function getCurrentTab() {
    const query = (await chrome.tabs.getCurrent()) as chrome.tabs.Tab
    return query
}

const Tabs = () => {
    const [highlightedTab, setHighlightedTab] = useState(-1)
    const { activeTabs, currentTab, activeTabRefetch, permissionGranted, tabListener } = useTabs()
    const altHeld = useAltKeyHeld(
        () => null,
        () => null,
    )

    tabListener()

    useLayoutEffect(() => {
        getCurrentTab().then((tab) => setHighlightedTab(tab.index))
    }, [])

    function unUsed() {}

    function downCallBack() {
        setHighlightedTab((prev) => prev + 1)
    }

    function upCallBack() {
        setHighlightedTab((prev) => prev - 1)
    }

    function emptyCallback() {
        return null
    }

    function enterCallback(e: KeyboardEvent) {
        try {
            if (e.key === 'Enter') {
                // TODO: Figure out how to prevent this error
                // @ts-ignore
                chrome.tabs.update(activeTabs[highlightedTab].id, {
                    active: true,
                })
                {
                    currentTab?.id && chrome.tabs.remove(currentTab.id)
                }
            }
        } catch (err) {
            alert(err)
        }
        return
    }

    useEffect(() => {
        if (!activeTabs) return
        if (highlightedTab + 1 > activeTabs.length) {
            setHighlightedTab(0)
        }
        if (highlightedTab < 0) {
            setHighlightedTab(activeTabs.length - 1)
        }
    }, [highlightedTab])

    useEffect(() => {
        window.addEventListener('keydown', enterCallback)
        return () => window.removeEventListener('keydown', enterCallback)
    }, [highlightedTab])

    useKeyHeldListener('j', downCallBack, emptyCallback)
    useKeyHeldListener('arrowdown', downCallBack, emptyCallback)

    useKeyHeldListener('k', upCallBack, emptyCallback)
    useKeyHeldListener('arrowup', upCallBack, emptyCallback)

    useEffect(() => {
        if (highlightedTab !== -1) {
            const focused = document.getElementsByClassName(String(highlightedTab))
            if (focused[0]) {
                console.log(focused[0])
                focused[0].scrollIntoView({ behavior: 'auto' })
            }
        }
    }, [highlightedTab])

    // useEffect(() => {

    // function indexCallback(event: KeyboardEvent) {
    //     // should be optimized but that's for future Stephen
    //     console.log('indexCallback called with: ' + typeof event.key)
    //     if (event.altKey) {
    //         console.log('indexCallback with altKey')
    //         dispatch(setAltHeld(true))
    //     }

    //     const table: Record<string, number> = {
    //         '1': 0,
    //         '2': 1,
    //         '3': 2,
    //         '4': 3,
    //         '5': 4,
    //         '6': 5,
    //         '7': 6,
    //         '8': 7,
    //         '9': 8,
    //         '0': 9,
    //         '!': 10,
    //         '@': 11,
    //         '#': 12,
    //         $: 13,
    //         '%': 14,
    //         '^': 15,
    //         '&': 16,
    //         '*': 17,
    //         '(': 18,
    //         ')': 19,
    //     }
    //     if (tabs && tabs[table[event.key]])
    //         chrome.tabs.update(tabs[table[event.key]].id!, { active: true })
    // }

    // ;(async () => {
    //     const permissionGranted = await usePermissions('tabs')
    //     setPermissionGranted(permissionGranted)
    //     window.addEventListener('keydown', indexCallback)
    //     window.addEventListener('keyup', keyupCallback)
    // })()

    // return () => {
    //     window.removeEventListener('keydown', indexCallback)
    //     window.removeEventListener('keyup', keyupCallback)
    // }
    // }, [tabs])

    // useEffect(() => {
    //     clearInterval(timer)
    //     setDay(days[new Date().getDay()])
    //     setTime(
    //         new Date().toLocaleString('en-CA', {
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             second: '2-digit',
    //         }),
    //     )

    //     timer = setInterval(() => {
    //         setTime(
    //             new Date().toLocaleString('en-CA', {
    //                 hour: '2-digit',
    //                 minute: '2-digit',
    //                 second: '2-digit',
    //             }),
    //         )
    //     }, 1000)

    //     return () => {
    //         clearInterval(timer)
    //     }
    // }, [])

    // const content = tabs?.filter((tab) => tab.title?.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div
            className="flex h-full  w-full flex-col  items-center justify-start  overflow-scroll px-4 pb-8 scrollbar-hide"
            onClick={() => console.log('tabs clicked')}
        >
            {!permissionGranted ? (
                <PermissionRequestButton />
            ) : (
                <div className="w-2/3 items-center justify-center ">
                    <div className="pb-2 font-primaryFont text-4xl font-black">Tabs</div>
                    {activeTabs?.length &&
                        activeTabs.map((tab, index) => {
                            return (
                                <div
                                    className={`${
                                        highlightedTab === index
                                            ? 'bg-secondary font-bold text-primary '
                                            : ' '
                                    } ${index} font-base flex  items-center font-primaryFont text-xl tracking-wider transition-all duration-100 scrollbar-hide hover:font-bold`}
                                    key={tab.id}
                                >
                                    <button
                                        className={`tabItem flex w-full cursor-pointer ${
                                            altHeld
                                                ? 'hover:bg-primary hover:font-bold'
                                                : 'hover:bg-accent'
                                        }  {altHeld} px-4
                                        text-left
                                        ${currentTab?.index === index && 'currentTab'}`}
                                        onClick={(e) => {
                                            // alt + click closes tab
                                            if (e.altKey)
                                                tab.id &&
                                                    chrome.tabs
                                                        .remove(tab.id)
                                                        .then(() => activeTabRefetch())
                                            else {
                                                tab.id &&
                                                    chrome.tabs.update(tab.id, {
                                                        active: true,
                                                    })
                                                {
                                                    currentTab?.id &&
                                                        chrome.tabs.remove(currentTab.id)
                                                }
                                            }
                                        }}
                                    >
                                        {altHeld ? (
                                            <div className={`w-12 `}>x</div>
                                        ) : (
                                            <div className="min-w-[3rem]  ">
                                                {keyToTabArray[index]}
                                            </div>
                                        )}
                                        <div className={'text-left'}> {tab.title}</div>
                                    </button>
                                </div>
                            )
                        })}
                </div>
            )}
        </div>
    )
}

export const PermissionRequestButton = () => {
    return (
        <button
            onClick={() => {
                chrome.permissions.request({
                    permissions: ['tabs'],
                    origins: ['https://*/*'],
                })
            }}
        >
            request
        </button>
    )
}

export default Tabs
