import { useRef } from 'react'

const FloatingInput = ({
    setFilter,
}: {
    setFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    function onChange() {
        console.log('onChange hit')
        setFilter(inputRef?.current?.value ?? '')
    }
    return (
        <input
            className="absolute bg-slate-400 rounded-md top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-1/3 h-12"
            ref={inputRef}
            onChange={onChange}
        />
    )
}
export default FloatingInput
