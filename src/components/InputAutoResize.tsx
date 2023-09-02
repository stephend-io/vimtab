import { useEffect, useState } from 'react'

type Sizes = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
    id: string
    maxSize: Sizes
}
const InputAutoResize = ({ id }: Props) => {
    const data = localStorage.getItem(id)
    const [content, setContent] = useState(data ?? '')
    const [width, setWidth] = useState<string>('50px')
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        autoAdjust()
    }, [content])

    const autoAdjust = () => {
        const inputArea = document.getElementById('input-' + id)

        // TODO: adjusting based on sizes
        if (content.length * 8 + 5 < 200) setWidth('200px')
        else if (content.length * 8 + 5 < 1400) setWidth(String(content.length * 8 + 50) + 'px')
    }

    return (
        <input
            className={`input-${id} bg-slate-200 text-center rounded-md`}
            style={{ width: width }}
            value={content}
            placeholder="today's todo"
            onChange={(e) => {
                console.log(e.target.value)
                setContent(e.target.value)
            }}
        />
    )
}
export default InputAutoResize
