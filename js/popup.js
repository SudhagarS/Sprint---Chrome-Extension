var defaultUrls = ["www.facebook.com",
    "www.twitter.com",
    "www.youtube.com",
    "www.quora.com",
    "www.reddit.com"
]
var defaultDuration = 2;
var blockedUrls;

document.body.onload = function() {
    console.log("onload of body");
    if (localStorage["sprint_duration"] === undefined) {
        localStorage["sprint_duration"] = defaultDuration;
    }
    setDuration(parseInt(localStorage["sprint_duration"]));
    var tempUrlsStr = localStorage["sprint_blocked_urls"]
    if (!tempUrlsStr) {
        localStorage["sprint_blocked_urls"] = JSON.stringify(defaultUrls);
    }
    blockedUrls = JSON.parse(localStorage["sprint_blocked_urls"]);
    updateDom();
    
    if (localStorage["sprint_timer"] === undefined) {
        addStartButtonClickListener();
        addAddButtonClickListener();
        addArrowsClickListener();
    } else {
        hideElems();
        setTime();
    }
}

function setTime() {
    var button = document.getElementById("start_button");

    var startedTime = parseInt(localStorage["sprint_timer"])
    var timeElapsedInMins = ((Date.now() - startedTime) / (1000 * 60)) % 60;
    var alarmDurationInMin = parseInt(localStorage["sprint_duration"]) * 60;
    var remainingMins = Math.floor(alarmDurationInMin - timeElapsedInMins)
    
    button.value = convertToHrMinForm(remainingMins);
    button.style.background = "#9E0B30";
}

function convertToHrMinForm(minutes) {
    var hr = Math.floor(minutes / 60);
    var remMin = minutes % 60;
    return hr + ":" + remMin;
}

function setDuration(duration) {
    var durSpan = document.getElementsByClassName("duration")[0];
    durSpan.innerHTML = duration + (duration == 1 ? " hour" : " hours");
}

function addArrowsClickListener() {
    var leftArrow = document.getElementsByClassName("left_arrow")[0];
    leftArrow.addEventListener('click', function() {
        curDur = parseInt(localStorage["sprint_duration"]);
        if (curDur == 1) {
            return;
        }
        curDur--;
        localStorage["sprint_duration"] = curDur;
        setDuration(curDur);
    });

    var rightArrow = document.getElementsByClassName("right_arrow")[0];
    rightArrow.addEventListener('click', function() {
        curDur = parseInt(localStorage["sprint_duration"]);
        curDur++;
        localStorage["sprint_duration"] = curDur;
        setDuration(curDur);
    });
}

function addStartButtonClickListener() {
    var button = document.getElementById("start_button");
    button.addEventListener('click', function() {
        chrome.extension.getBackgroundPage().initSprint(blockedUrls);
        hideElems();
        setTime();
    }, false);
}

function addAddButtonClickListener() {
    var button = document.getElementById("add_button");
    button.addEventListener('click', function() {
        console.log("Add button clicked");
        var textfield = document.getElementsByName("new_site_text")[0];
        var url = textfield.value;
        var isValidUrl = checkUrl(url);
        if (isValidUrl) {
            blockedUrls.push(url);
            localStorage["sprint_blocked_urls"] = JSON.stringify(blockedUrls);
            updateDom();
            textfield.value = "";
            setErrorContent("");
        } else {
            setErrorContent(url.length == 0 ? "Enter url" : "Url is invalid");
        }
    }, false);
}

function setErrorContent(content) {
    var error = document.getElementById("error");
    error.innerHTML = content;
}

function updateDom() {
    var sitesWrapper = document.getElementById("sites_list");
    sitesWrapper.innerHTML = "";
    for (var i = 0; i < blockedUrls.length; i++) {
        var siteDiv = getSiteDiv(getSpan(blockedUrls[i], "site_url", -1),
            i > 1 ? getSpan("remove", "remove_but", i) : null);
        siteDiv.setAttribute("class", "site");
        sitesWrapper.appendChild(siteDiv);
        sitesWrapper.appendChild(document.createElement("br"))
    };
}

function getSiteDiv(span1, span2) {
    var div = document.createElement("div");
    div.appendChild(span1);
    if (span2) {
        div.appendChild(span2);
    }
    return div;
}

function getSpan(content, classvalue, i) {
    //<span class="remove_but">remove</span>
    var span = document.createElement("span");
    span.innerHTML = content;
    if (i != -1) {
        span.setAttribute("class", classvalue + " dohide");
        span.addEventListener('click', function() {
            blockedUrls.splice(i, 1);
            localStorage["sprint_blocked_urls"] = JSON.stringify(blockedUrls);
            updateDom();
        }, false);
    } else {
        span.setAttribute("class", classvalue);
    }
    return span;
}

function checkUrl(url) {
    var r = /(www\.)?[a-z\d]+\.com/;
    return r.test(url);
}

function hideElems() {
    var elemsArr = document.getElementsByClassName("dohide");
    for (var i = 0; i < elemsArr.length; i++) {
        elemsArr[i].style.visibility = "hidden";
    };
}