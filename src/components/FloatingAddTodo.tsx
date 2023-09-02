import { get, set } from 'idb-keyval'

type Props = {
    toggleModal: () => void
}
const FloatingAddTodo = ({ toggleModal }: Props) => {
    return (
        <button
            className={`absolute bottom-8 right-8 h-12 w-12 rounded-full bg-slate-200 text-center text-4xl font-medium text-slate-800 transition-all duration-150 hover:bg-slate-400 hover:text-slate-900`}
            onClick={toggleModal}
        >
            +
        </button>
    )
}
export default FloatingAddTodo
