chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
    chrome.storage.sync.set({state:"OFF"})

});
chrome.action.onClicked.addListener(async (tab) => {
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
    if (nextState === "ON") {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.executeScript({
            files : ['scripts/startRecorder.js'],
                target: { tabId: tab.id },
            });
   } else if (nextState === "OFF") {
        // Remove the CSS file when the user turns the extension off

        await chrome.scripting.executeScript({
            files : ['scripts/stopRecorder.js'],
            target: { tabId: tab.id },
        });
    }
});

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    chrome.storage.sync.get('state',({state}) =>{
        console.log("cosa buena.js")
        console.log(tabId)
        console.log(changeInfo)
        console.log(tab)
        chrome.action.setBadgeText({
            text: state
        });
        console.log(sessionStorage.commandList)
        chrome.storage.sync.get(commandList,(commandList) =>{
            console.log(commandList)
        })

        if (state === "ON") {
            // Insert the CSS file when the user turns the extension on
             chrome.scripting.executeScript({
                 files : ['scripts/startRecorder.js'],
                target: { tabId: tab.id },
            });
        } else if (state === "OFF") {
            // Remove the CSS file when the user turns the extension off

             chrome.scripting.executeScript({
                files : ['scripts/stopRecorder.js'],
                target: { tabId: tab.id },
            });
        }
    });
});