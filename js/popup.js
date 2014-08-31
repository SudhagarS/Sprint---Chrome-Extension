var defaultUrls = ["www.facebook.com",
                    "www.twitter.com",
                    "www.youtube.com",
                    "www.quora.com",
                    "www.reddit.com"
                    ]

var blockedUrls;

document.body.onload = function() {
    console.log("onload of body");
    var tempUrlsStr = localStorage["blocked_urls"]
    if(!tempUrlsStr){
        localStorage["blocked_urls"] = JSON.stringify(defaultUrls);
    }
    blockedUrls = JSON.parse(localStorage["blocked_urls"]);
    updateDom();
    addStartButtonClickListener();
    addAddButtonClickListener();
}

function addStartButtonClickListener(){
    var button = document.getElementById("start_button");
    button.addEventListener('click', function(){
        chrome.extension.getBackgroundPage().initSprint(blockedUrls);
    }, false);
}

function addAddButtonClickListener(){
    var button = document.getElementById("add_button");
    button.addEventListener('click', function(){
        console.log("Add button clicked");
        var textfield = document.getElementsByName("new_site_text")[0];
        var url = textfield.value;
        var isValidUrl = checkUrl(url);
        if(isValidUrl){
            blockedUrls.push(url);
            localStorage["blocked_urls"] = JSON.stringify(blockedUrls);
            updateDom();
            textfield.value = "";
            setErrorContent("");
        }
        else{
            setErrorContent(url.length==0 ? "Enter url" : "Url is invalid");
        }
    }, false);
}

function setErrorContent(content){
    var error = document.getElementById("error");
    error.innerHTML = content;
}

function updateDom(){
    var sitesWrapper = document.getElementById("sites_list");
    sitesWrapper.innerHTML = "";
    for(var i=0; i<blockedUrls.length; i++){
        var siteDiv = getSiteDiv(getSpan(blockedUrls[i], "site_url"),
            getSpan("remove", "remove_but"));
        sitesWrapper.appendChild(siteDiv);
        sitesWrapper.appendChild(document.createElement("br"))
    }
}

function getSiteDiv(span1, span2){
    var div = document.createElement("div");
    div.appendChild(span1);
    div.appendChild(span2);
    return div;
}

function getSpan(content, classvalue){
    //<span class="remove_but">remove</span>
    var span = document.createElement("span");
    span.innerHTML = content;
    span.setAttribute("class", classvalue)
    return span;
}

function checkUrl(url){
    var r = /(www\.)?[a-z\d]+\.com/;
    return r.test(url);
}