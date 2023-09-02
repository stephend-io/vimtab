import { useQuery } from '@tanstack/react-query'
import useKeyboardShortcuts, { useAllKeyListener } from './useKeyboardShortcuts'
import { useEffect, useState } from 'react'

export const keyToTabTable: Record<string, number> = {
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
    q: 20,
    w: 21,
    e: 22,
    r: 23,
    t: 24,
    y: 25,
    u: 26,
    i: 27,
    o: 28,
    p: 29,
    Q: 30,
    W: 31,
    E: 32,
    R: 33,
    T: 34,
    Y: 35,
    U: 36,
    I: 37,
    O: 38,
    P: 39,
    a: 40,
    s: 41,
    d: 42,
    f: 43,
    g: 44,
    A: 45,
    S: 46,
    D: 47,
    F: 48,
    G: 49,
    z: 50,
    x: 51,
    c: 52,
    v: 53,
    b: 54,
    n: 55,
    m: 56,
    ',': 57,
    '.': 58,
    '/': 59,
    Z: 60,
    X: 61,
    C: 62,
    V: 63,
    B: 64,
    N: 65,
    M: 66,
    '<': 67,
    '>': 68,
    '?': 69,
}
export const keyToTabArray: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'a',
    's',
    'd',
    'f',
    'g',
    'A',
    'S',
    'D',
    'F',
    'G',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    ',',
    '.',
    '/',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<',
    '>',
    '?',
]

export default function useTabs() {
    console.log('useTabs called')
    function requestPermission() {
        chrome.permissions.request({
            permissions: ['tabs'],
            origins: ['https://*/*'],
        })
    }
    const permissionGranted = useQuery(
        ['tabPermission'],
        async () =>
            await chrome.permissions.contains({
                permissions: ['tabs'],
            }),
        { cacheTime: 1000 },
    )

    const { data: activeTabs, refetch: activeTabRefetch } = useQuery<chrome.tabs.Tab[]>(
        ['activeTabs'],
        async () =>
            await chrome.tabs.query({
                currentWindow: true,
            }),
        { cacheTime: 0 },
    )

    const { data: otherTabs, refetch: otherTabRefetch } = useQuery(
        ['otherTabs'],
        async () =>
            await chrome.tabs.query({
                currentWindow: false,
            }),
        { cacheTime: 0 },
    )

    const { data: currentTab } = useQuery(
        ['currentTab'],
        async () => await chrome.tabs.getCurrent(),
    )

    const tabListener = () => {
        function callback(e: KeyboardEvent) {
            if (keyToTabTable[e.key] || keyToTabTable[e.key] === 0) {
                console.log('input is: ' + e.key)
                if (activeTabs && activeTabs.length >= keyToTabTable[e.key]) {
                    console.log('valid cuz')
                    // @ts-ignore
                    chrome.tabs.update(activeTabs[keyToTabTable[e.key]].id, { active: true })
                    // @ts-ignore
                    chrome.tabs.remove(currentTab.id)
                }
            }
        }

        useKeyboardShortcuts(callback)
    }
    function activeTabCallback(e: KeyboardEvent) {
        console.log('tabListener activeTabCallback called')
        if (activeTabs && activeTabs.length >= keyToTabTable[e.key])
            // @ts-ignore
            chrome.tabs.update(activeTabs[keyToTabTable[e.key]].id, { active: true })
    }

    return {
        permissionGranted,
        activeTabs,
        activeTabRefetch,
        otherTabs,
        otherTabRefetch,
        currentTab,
        tabListener,
        requestPermission,
        activeTabCallback,
    }
}
