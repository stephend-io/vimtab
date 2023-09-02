import { useLayoutEffect, useState } from 'react'
import usePermissions from '../../hooks/usePermissions'

const bookmarkSample = {
    dateAdded: 1682417667359,
    id: '7',
    index: 0,
    parentId: '1',
    title: 'CS253 - Web Security',
    url: 'https://web.stanford.edu/class/cs253/',
}

type BookmarkObjects = {
    title: string
    bookmarks: typeof bookmarkSample
}

const Bookmarks = () => {
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
    const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])
    useLayoutEffect(() => {
        ;(async () => {
            const permissionGranted = await usePermissions('bookmarks')
            if (permissionGranted) setPermissionGranted(true)
            // const bookmarkLists= await chrome.bookmarks.getTree()
            const recentbookmarks = await chrome.bookmarks.getRecent(100)
            setBookmarks(recentbookmarks)
        })()
    }, [])
    if (!permissionGranted)
        return (
            <div>
                {' '}
                <button
                    onClick={() => {
                        chrome.permissions.request({
                            permissions: ['bookmarks'],
                        })
                    }}
                >
                    request permission
                </button>
            </div>
        )
    return (
        <div className="w-full flex flex-col bg-slate-200 justify-center font-primaryFont text-2xl pl-12">
            {bookmarks.map((bookmark) => (
                <a
                    className="hover:font-black cursor-pointer"
                    href={bookmark.url}
                    onMouseOver={() => console.log(bookmark.url)}
                >
                    {bookmark.title ?? '(untitled)'}
                </a>
            ))}
        </div>
    )
}
export default Bookmarks
