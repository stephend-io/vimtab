import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import {
    useKeyHeldListener,
    useKeyListener,
    useKeyboardNumbers,
} from '../../hooks/useKeyboardShortcuts'
import usePermissions from '../../hooks/usePermissions'
import { get } from 'idb-keyval'
import Suggestions from '../../components/Suggestions'

export type Suggestion = {
    title: string
    url: string
    id: string
    suggestionType: 'Bookmark' | 'Search'
}

type SearchTypes = 'Default' | 'Tabs'
export type SearchEngines = 'DuckDuckGo' | 'Google' | 'Bing'

// number of data returned by both search and bookmarks are forced for UX, UI, and performance reasons
const maxSearchResults = 10

type showInputType = React.Dispatch<React.SetStateAction<boolean>>
const Input = ({ showInput }: { showInput: showInputType }) => {
    const [input, setInput] = useState<string>('')
    const [inputActive, setInputActive] = useState(true)
    const [suggestionsArr, setSuggestionsArr] = useState<Suggestion[]>([])
    const [highlightedTab, setHighlightedTab] = useState(-1)
    const [searchType, setSearchType] = useState<SearchTypes>('Default')
    const [searchEngine, setSearchEngine] = useState<SearchEngines>('DuckDuckGo')
    const [isURLInput, setIsURLInput] = useState(false)

    const { permissionGranted, requestPermission } = usePermissions('history')

    const divRef = useRef<HTMLDivElement>(null)

    let inputTimeoutId: NodeJS.Timer
    const inputDebounce = 200

    useEffect(() => {
        get('vimTab-searchEngine').then((searchRes) => {
            if (searchRes) setSearchEngine(searchRes)
        })
    }, [])

    useEffect(() => {
        clearTimeout(inputTimeoutId)
        ;(async () => {
            if (input.length === 0) {
                console.log('input length is 0')
                inputTimeoutId = setTimeout(() => {
                    console.log('if 0 called + 2')
                    setSuggestionsArr([])
                }, inputDebounce)
                return
            }
            if (
                input.split('.').length >= 2 ||
                input.startsWith('https') ||
                input.startsWith('localhost:') ||
                input.startsWith('www.')
            ) {
                setIsURLInput(true)
            } else {
                setIsURLInput(false)
            }

            inputTimeoutId = setTimeout(async () => {
                const combinedSuggestions: Suggestion[] = []
                if (searchType === 'Default') {
                    const bookmarkData = chrome.bookmarks
                        .search({ query: input })
                        .then((bookmarks) => {
                            const bookmarksArr: Suggestion[] = []
                            bookmarks.slice(0, maxSearchResults).map((bookmark) => {
                                bookmarksArr.push({
                                    id: bookmark.id,
                                    title: bookmark.title,
                                    url: bookmark.url ?? '',
                                    suggestionType: 'Bookmark',
                                })
                            })
                            return bookmarksArr
                        }) as Promise<Suggestion[]>
                    console.log(await bookmarkData)
                    const searchData = chrome.history
                        .search({ text: input, maxResults: maxSearchResults })
                        .then((searchData) => {
                            const searchArr: Suggestion[] = []
                            searchData.map((search) => {
                                searchArr.push({
                                    id: search.id,
                                    title: search.title ?? '',
                                    url: search.url ?? '',
                                    suggestionType: 'Search',
                                })
                            })
                            return searchArr
                        }) as Promise<Suggestion[]>

                    Promise.all([bookmarkData, searchData]).then((values) => {
                        console.log(values)
                        values.map((suggestions) => {
                            console.log(suggestions)
                            if (suggestions) {
                                console.log('valid suggestions arr')
                                suggestions.map((suggestion) => {
                                    combinedSuggestions.push(suggestion)
                                })
                            }
                        })
                        setSuggestionsArr(combinedSuggestions)
                    })
                    // .then(() => {
                    //     console.log('suggestions is')
                    //     console.log(suggestions)
                    // })
                } else if (searchType === 'Tabs') {
                    const tabData = chrome.tabs.query({ title: input }).then((search) => {
                        console.log('tabData')
                        console.log(search)
                    })
                }

                // Promise.all([searchData,bookmarkData,tabData])
                // const suggestionRes: Suggestion[] = []
                // setSuggestions(suggestionRes)
            }, inputDebounce)
            // }
        })()
        return () => clearTimeout(inputTimeoutId)
    }, [input, searchType])

    useEffect(() => {
        if (suggestionsArr.length > 0 && !inputActive) {
            setHighlightedTab(0)
        } else {
            setHighlightedTab(-1)
        }

        // 10 millisecond timeout is necessary to take back focus upon new tab creation

        if (inputActive)
            setTimeout(function () {
                divRef?.current?.focus()
            }, 10)
        else divRef?.current?.blur()
    }, [inputActive])

    useEffect(() => {
        console.log('useEffect Called')
        function effectcallback(e: KeyboardEvent) {
            console.log(`Key is: ${e.key}`)
            if (e.key === 'Escape') {
                if (input.length <= 0) {
                    // setShowInput(false)
                    showInput(false)
                    setInputActive(false)
                    setHighlightedTab(-1)
                    return
                }
                setInputActive(false)

                // @ts-ignore
                document?.activeElement?.blur()
            }

            if (e.key === 'Escape' && !inputActive) {
                showInput(false)
            }

            if (e.key === 'Enter' && inputActive) {
                if (isURLInput) {
                    // chrome.tabs.create needs a proper protocol or else it seemingly just appends it to the end of the current url
                    if (!input.startsWith('https') && !input.startsWith('localhost')) {
                        chrome.tabs.getCurrent().then((currTab) => {
                            Promise.all([
                                chrome.tabs.create({
                                    url: 'https://' + input,
                                    active: true,
                                }),
                                currTab?.id && chrome.tabs.remove(currTab?.id),
                            ])
                        })
                    } else {
                        chrome.tabs.getCurrent().then((currTab) => {
                            Promise.all([
                                chrome.tabs.create({
                                    url: input,
                                    active: true,
                                }),
                                currTab?.id && chrome.tabs.remove(currTab?.id),
                            ])
                        })
                    }

                    return
                } else {
                    const urlObjects: Record<SearchEngines, string> = {
                        Google: 'https://www.google.com/search?q=',
                        Bing: 'https://www.bing.com/search?q=',
                        DuckDuckGo: 'https://www.duckduckgo.com/?q=',
                    }
                    const baseurl = urlObjects[searchEngine]
                    const queryString = divRef.current?.textContent?.replaceAll(' ', '+')

                    chrome.tabs.update({
                        url: baseurl + queryString,
                    })
                }
                return
            }
            console.log('AFTER WHAT YOU DONT WANT IT TO')
            // if (e.key === 'Enter' || (e.key.toLowerCase() === 'i' && !showInput)) {
            if (e.key.toLowerCase() === 'i') {
                setHighlightedTab(-1)
                // setShowInput(true)
                showInput(true)
                setInputActive(true)
                e.preventDefault()
            }

            if (e.key === 'Enter' && !inputActive) {
                // setShowInput(true)
                showInput(true)
                if (highlightedTab !== -1) {
                    chrome.tabs.update({ url: suggestionsArr[highlightedTab].url, active: true })
                    return
                }
                setInputActive(true)
                e.preventDefault()
            }

            function downCallBack() {
                const nextIndex = highlightedTab + 1
                if (nextIndex >= suggestionsArr.length) return

                setHighlightedTab(nextIndex)
            }

            function emptyCallback() {
                return null
            }

            if ((e.key.toLowerCase() === 'j' && !inputActive) || e.key === 'ArrowDown') {
                // useKeyHeldListener('j', downCallBack, emptyCallback)
                // useKeyHeldListener('arrowdown', downCallBack, emptyCallback)
                // ! UNCOMMENT
                // const nextIndex = highlightedTab + 1
                // if (nextIndex >= suggestionsArr.length) return
                // setHighlightedTab(nextIndex)
            }

            if ((e.key.toLowerCase() === 'k' && !inputActive) || e.key === 'ArrowUp') {
                const nextIndex = highlightedTab - 1
                if (nextIndex < 0) return
                setHighlightedTab(nextIndex)
            }
        }

        function mouseCallback(e: MouseEvent) {
            if (input.length <= 0) {
                setInputActive(false)
            }
        }

        window.addEventListener('keyup', effectcallback)
        window.addEventListener('mouseup', mouseCallback)

        return () => {
            window.removeEventListener('keyup', effectcallback)
            window.removeEventListener('mouseup', mouseCallback)
        }
    }, [input, inputActive, highlightedTab])

    function inputSetter(e: React.FormEvent<HTMLDivElement>) {
        setInput(e.currentTarget.innerHTML.split('<div>')[0])
    }

    return (
        <div className=" absolute  right-0 top-0 flex h-screen w-screen items-center justify-center">
            {!permissionGranted && <button onClick={requestPermission}>request permission</button>}
            {permissionGranted && (
                <div
                    className={`mx-auto my-auto flex w-[80vw] flex-col  items-start justify-start  rounded-md border-2  border-primary bg-primary  p-2 shadow-2xl ${
                        inputActive ? 'border-1 border-secondary' : ''
                    }`}
                >
                    <div className="w-full rounded-lg bg-secondary p-4 saturate-50">
                        {/* flex is necessary to not cause excess line breaks, but line break still happens if total width of div overflows*/}
                        <div
                            contentEditable
                            onInput={inputSetter}
                            className="flex w-full flex-row flex-wrap overflow-scroll border-2 border-secondary text-4xl text-primary outline-none scrollbar-hide"
                            ref={divRef}
                            onClick={() => {
                                setInputActive(true)
                            }}
                        />
                    </div>

                    {suggestionsArr.length > 0 && (
                        <Suggestions inputActive={inputActive} suggestions={suggestionsArr} />
                    )}

                    {(() => {
                        if (input.length > 0 && (inputActive || suggestionsArr.length <= 0)) {
                            if (isURLInput) {
                                return (
                                    <div className="mt-2 w-full border-2 border-primary bg-secondary p-2 text-primary">
                                        Go to {input}
                                    </div>
                                )
                            }
                            return (
                                <div className="mt-2 w-full border-2 border-primary bg-secondary p-2 text-primary">
                                    Search with {searchEngine}
                                </div>
                            )
                        }

                        return null
                    })()}
                </div>
            )}{' '}
        </div>
    )
}

export default Input
