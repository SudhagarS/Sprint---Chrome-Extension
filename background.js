var callback = function (details) {
    console.log("Intercepted: " + details.url);
    return {cancel: true};
}

var opt_extraInfoSpec = ["blocking"];

function initSprint(blockedUrls) {
    console.log('Sprint icon clicked');
    console.log(blockedUrls);
    chrome.browserAction.setIcon({
        path: "images/icon2.png"
    });
    processUrls(blockedUrls)
    chrome.webRequest.onBeforeRequest.addListener(callback, {urls: blockedUrls}, opt_extraInfoSpec);
    chrome.alarms.create("SprintAlarm", {when: Date.now() + 10000});
    
    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('alarm called');
        chrome.webRequest.onBeforeRequest.removeListener(callback);
        chrome.browserAction.setIcon({
            path: "images/icon.png"
    });
    });
    console.log('alarm created');
}



function processUrls(urls){
    for(var i=0; i<urls.length; i++){
        urls[i] = "*://" + urls[i] + "/*";
    }
}