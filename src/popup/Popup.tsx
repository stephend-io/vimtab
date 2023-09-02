import { useEffect, useState } from 'react'
import './Popup.css'
import '../index.css'

function App() {
    const [crx, setCrx] = useState('create-chrome-ext')
    console.log('popup called')
    useEffect(() => {
        localStorage.setItem('testPopup', 'test working')
    }, [])

    return (
        <main className="right-1/2 top-0 flex h-[1500px] w-[1400px] bg-red-900 ">
            <h3>Popup Page!</h3>

            <h6>v 0.0.0</h6>

            <a href="https://www.npmjs.com/package/create-chrome-ext" target="_blank">
                Power by {crx}
            </a>
        </main>
    )
}

export default App
