export const Main = async () => {
    const currentTab = await chrome.tabs.getCurrent()
    chrome.tabs.create({ url: '../../newtabActual.html', active: true })
    chrome.tabs.remove(currentTab?.id!)
}
Main()
