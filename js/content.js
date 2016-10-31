chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
    sendResponse(document.all[0].outerHTML);
});
