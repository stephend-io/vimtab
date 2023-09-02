import { useEffect, useState } from 'react'
import { useKeyHeldListener, useKeyListener } from '../hooks/useKeyboardShortcuts'
import type { Suggestion } from '../newtab/pages/Input'

// TODO - Move keyboard shortcuts from the input component to this suggestions component
// Idea is to move the part of the code that controls the keys and UI that only functions when there are active suggestions to this
// and decouple it from the parts that are based on user input
const Suggestions = ({
    suggestions,
    inputActive,
}: {
    suggestions: Suggestion[]
    inputActive: boolean
}) => {
    const [highlightedTab, setHighlightedTab] = useState(0)

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
        if (inputActive) return
        if (e.key === 'Enter') {
            chrome.tabs.getCurrent().then((currTab) => {
                Promise.all([
                    chrome.tabs.create({
                        url: suggestions[highlightedTab].url,
                        // url: 'https://' + suggestions[highlightedTab].url,
                        active: true,
                    }),
                    currTab?.id && chrome.tabs.remove(currTab?.id),
                ])
            })
        }
        return
    }

    useEffect(() => {
        if (highlightedTab + 1 > suggestions.length) {
            setHighlightedTab(0)
        }
        if (highlightedTab < 0) {
            setHighlightedTab(suggestions.length - 1)
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

    return (
        <div className="flex max-h-[80vh] w-full flex-col items-start justify-start overflow-scroll pt-2 scrollbar-hide">
            {suggestions?.map((suggestion, index) => {
                const { title, url, id, suggestionType } = suggestion
                return (
                    <a
                        href={url}
                        className={`flex w-full items-center gap-4 p-1  hover:bg-secondary hover:text-primary ${
                            highlightedTab === index ? 'bg-secondary text-primary' : ''
                        } ${index}`}
                        key={id}
                    >
                        <div className=" line-clamp-1 w-1/2 text-lg font-bold">{title}</div>
                        <div className="line-clamp-1 w-1/2 text-sm font-medium">{url}</div>

                        <div className=" flex h-full w-12 justify-end">
                            {suggestionType === 'Bookmark' && <div className="">★</div>}
                        </div>
                    </a>
                )
            })}
        </div>
    )
}
export default Suggestions
