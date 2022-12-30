commandListSave = typeof(commandList) === 'undefined' ? [] : commandListSave;
offinstalled = typeof(offinstalled) === 'undefined' ? false : offinstalled;

async function executeScript(state, tab) {
    console.log("entra")
    if (state === "ON") {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.executeScript({
            files : ['scripts/startRecorder.js'],
            target: { tabId: tab.id },
        });
    } else if (state === "OFF") {
        // Remove the CSS file when the user turns the extension off
        if(!offinstalled){
            commandListSave = []
            await chrome.scripting.executeScript({
                files : ['scripts/stopRecorder.js'],
                target: { tabId: tab.id },
            });
        }
    }
}
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
    chrome.storage.sync.set({state:"OFF"})
    offinstalled =true

});
chrome.action.onClicked.addListener(async (tab) => {
    offinstalled=false
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'
    await chrome.storage.sync.set({state:nextState})
    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
    await executeScript(nextState, tab)

});
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    await chrome.storage.sync.get('state', async ({state}) =>{
        chrome.action.setBadgeText({
            text: state
        });
        if(changeInfo.status ==="complete"){
            console.log(state)
            await  executeScript(state, tab)
        }
    });


});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.text.length >= commandListSave.length){
        this.commandListSave = msg.text
        sendResponse(this.commandListSave);

    }else{
        this.commandListSave.push(msg.text[1])
        sendResponse(this.commandListSave);

    }
});