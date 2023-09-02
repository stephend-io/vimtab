import { useEffect, useState } from 'react'
import useDateAndTime from '../hooks/useDateAndTime'

import '../index.css'
import useKeyboardShortcuts, {
    useKeyListener,
    useKeyListenerNew,
} from '../hooks/useKeyboardShortcuts'
import useTabs from '../hooks/useTabs'
import MenuItems, { PermissionRequestButton } from './pages/Tabs'
import Settings from './pages/Settings'

import Input from './pages/Input'
import Home from './pages/Home'
import Tabs from './pages/Tabs'
import QuickAccess from './pages/QuickAccess'

// type Pages = 'home' | 'tabs' | 'blocks' | 'quickAccess' | 'todos' | 'settings' | 'theme' | 'input'
// const pages: Pages[] = ['home', 'tabs', 'blocks', 'quickAccess', 'todos', 'settings', 'theme']

type Pages = 'home' | 'tabs' | 'settings'
const pages: Pages[] = ['home', 'tabs', 'settings']

function useVimTabNavigation(
    categories: Pages[],
    currentIndex: number,
    setCategory: React.Dispatch<React.SetStateAction<Pages>>,
) {
    const rightCB = () => {
        if (currentIndex + 1 <= categories.length) setCategory(categories[currentIndex + 1])
    }
    const leftCB = () => {
        if (currentIndex - 1 <= categories.length) setCategory(categories[currentIndex + 1])
    }
    useKeyListener(['l', 'ArrowRight'], rightCB)
}

const Newtab = () => {
    // const { permissionGranted, requestPermission } = usePermissions('tabs')
    // const [currTab, setCurrTab] = useState<Pages>('home')
    const [currIndex, setCurrIndex] = useState(0)
    const { requestPermission, permissionGranted, activeTabs, activeTabCallback } = useTabs()
    const [showInput, setShowInput] = useState(true)

    // useVimTabNavigation(pages, 0, setCurrTab)

    function showInputCB() {
        setShowInput(true)
    }
    function hideInputCB() {
        setShowInput(false)
    }

    useEffect(() => {
        if (showInput) {
            return
        }
        const rightCB = () => {
            if (currIndex + 1 <= indexer.length - 1) setCurrIndex(currIndex + 1)
        }
        const leftCB = () => {
            if (currIndex - 1 >= 0) setCurrIndex(currIndex - 1)
        }

        const [rightListener, rightCleanUp] = useKeyListenerNew(['l', 'ArrowRight'], rightCB)
        const [leftListener, leftCleanUp] = useKeyListenerNew(['h', 'ArrowLeft'], leftCB)
        rightListener()
        leftListener()
        return () => {
            rightCleanUp()
            leftCleanUp()
        }
    }, [currIndex, showInput])

    useKeyListener(['i', 'enter'], showInputCB)

    // useEffect(() => {
    // useTab's event listeners have to declared in the page itself in order to ensure activeTabs are up to date
    // console.log('useeffect called')
    // window.addEventListener('keydown', activeTabCallback)
    // return () => window.removeEventListener('keydown', activeTabCallback)
    // }, [activeTabs])

    const indexer = [<Home />, <Tabs />, <Settings />]
    return (
        <div
            className="fixed h-screen w-screen bg-primary
         "
        >
            <div
                className="flex h-full w-full flex-col bg-primary  p-8 font-primaryFont text-2xl font-medium text-secondary"
                onClick={requestPermission}
            >
                <div className="flex w-full justify-between px-4">
                    <div>Vim tab</div>
                    <MenuTabItems
                        categories={pages}
                        currIndex={currIndex}
                        setTabIndex={setCurrIndex}
                    />
                </div>
                {/* <Header /> */}
                {showInput && <Input showInput={setShowInput} />}
                <div className=" flex h-full w-full items-center justify-center ">
                    {indexer[currIndex]}
                </div>
                <Footer currIndex={currIndex} />
            </div>
        </div>
    )
}

const Footer = ({ currIndex }: { currIndex: number }) => {
    const { requestPermission } = useTabs()
    const shortcuts = [
        'L: right menu item H: left menu item I: spotlight ESC: unfocus spotlight',
        'I: tab spotlight, ESC: unfocus spotlight, #: enter tab ctrl + #: go to tab, ctrl + alt + #: close tab',
        '#: Go to quickaccess',
        'TODO: SETTINGS',
    ]
    return <div className="absolute bottom-2 left-12 flex gap-4">{shortcuts[currIndex]}</div>
}

const Header = () => {
    return (
        <div className=" flex h-[5vh] w-full flex-row justify-between">
            <div>yet another new tab app</div>
            <MenuItems />
        </div>
    )
}
const MenuTabItems = ({
    categories,
    currIndex,
    setTabIndex,
}: {
    categories: Pages[]
    currIndex: number
    setTabIndex: React.Dispatch<React.SetStateAction<number>>
}) => {
    return (
        <div className="flex gap-4">
            {categories.map((page, index) => {
                const activetab = index === currIndex
                return (
                    <button
                        className={`${
                            activetab
                                ? 'bg-secondary text-primary'
                                : ' hover:bg-secondary hover:text-primary'
                        } -mb-2 -ml-2 p-2 `}
                        onClick={() => setTabIndex(index)}
                        key={page}
                    >
                        {page}
                    </button>
                )
            })}
        </div>
    )
}
const Left = () => {
    const { time, day, month, date } = useDateAndTime()
    return (
        <div className="flex w-3/4 flex-col justify-between text-secondary">
            <div>
                <div className="text-8xl font-black tracking-widest">{time}</div>

                <div className="ml-2 flex gap-2">
                    <div>{day}</div>
                    <div>{month}</div>
                    <div>{date}</div>
                </div>
            </div>
            <div className=" text-8xl font-black">Do home page UI </div>
        </div>
    )
}

export default Newtab
