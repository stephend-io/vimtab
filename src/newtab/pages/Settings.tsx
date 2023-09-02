import { SearchEngines } from './Input'
type Props = {}
const Settings = (props: Props) => {
    return (
        <div className="flex h-full w-full flex-col border-2 border-red-100">
            <div>Settings</div>
            <div>Search Engine</div>
            <div>Color</div>
        </div>
    )
}
export default Settings
