var callback = function (details) {
    console.log("Intercepted: " + details.url);
    return {cancel: true};
}

var opt_extraInfoSpec = ["blocking"];

function initSprint(blockedUrls) {
    console.log('Sprint icon clicked');
    localStorage["sprint_timer"] = Date.now();
    chrome.browserAction.setIcon({
        path: "images/icon2.png"
    });
    chrome.webRequest.onBeforeRequest.addListener(callback, {urls: processUrls(blockedUrls)}, opt_extraInfoSpec);
    var alarmDurationInHrs = parseInt(localStorage["sprint_duration"])
    chrome.alarms.create("SprintAlarm", {when: (Date.now() + (alarmDurationInHrs*60*60*1000) )});
    
    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('alarm called');
        localStorage.removeItem("sprint_timer");
        chrome.webRequest.onBeforeRequest.removeListener(callback);
        chrome.browserAction.setIcon({
            path: "images/icon.png"
        });
    });
    console.log('alarm created');
}



function processUrls(urls){
    var urlsProcessed = urls.slice()
    for(var i=0; i<urlsProcessed.length; i++){
        urlsProcessed[i] = "*://" + urlsProcessed[i] + "/*";
    }
    return urlsProcessed;
}