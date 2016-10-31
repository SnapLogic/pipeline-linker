// only enable the extension on SnapLogic Designer
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostSuffix: "elastic.snaplogic.com", pathEquals: "/sl/designer.html"},
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// when the PipelineLinker extension is triggered
chrome.pageAction.onClicked.addListener(function (browserTab) {
    // execute the script that gets injected into page of the current tag
    chrome.tabs.executeScript(null, {file: "js/content.js"}, function () {
        // send a message to content script
        chrome.tabs.sendMessage(browserTab.id, "Background page started.", function (response) {
            // receive the HTML from the tab's page and convert it to a DOM Document
            var doc = htmlToDocument(response);
            // get the shell around the pipeline canvas
            var shell = doc.getElementById("sl-shell-foot-lh");
            if (shell != null) {
                // the pipeline tabs in Designer
                var pipelineTabs = shell.querySelectorAll(
                    "div.sl-pipeline-tabs.ui-sortable > div.sl-tab-body.sl-x-select");
                if (pipelineTabs != null && pipelineTabs.length == 1) {
                    var pipeline = pipelineTabs[0];
                    var activeOrg = getActiveOrg(doc);
                    copyToClipboard(buildPipelineLink(browserTab, pipeline, activeOrg));
                    createNotification(getPipelineTitle(pipeline),
                                       getFolderPath(pipeline) + " (" + activeOrg + ")");
                }
            }
        });
    });
});

function buildPipelineLink(tab, pipelineTab, orgName) {
    var snodeId = pipelineTab.getAttribute("data-snode-id");
    var pipelineLink = tab.url.split("?")[0] + "?pipe_snode=" + snodeId;
    if (orgName !== null) {
        pipelineLink = pipelineLink + "&active_org=" + orgName;
    }
    return pipelineLink;
}

function getFullPath(pipelineTab) {
    return pipelineTab.getAttribute("title");
}

function getFolderPath(pipelineTab) {
    var fullPath = getFullPath(pipelineTab);
    return fullPath.substring(0, fullPath.lastIndexOf("/"));
}

function getPipelineTitle(pipelineTab) {
    var fullPath = getFullPath(pipelineTab);
    return fullPath.substring(fullPath.lastIndexOf("/") + 1, fullPath.length);
}

function getActiveOrg(doc) {
    var org = doc.getElementById("slc-header-org");
    if (org != null) {
        return org.getAttribute("title").replace("-Development", "");
    } else {
        var hiddenOrg = doc.getElementById("slc-header-rh");
        var orgs = hiddenOrg.querySelectorAll("input[type=\"hidden\"]");
        if (orgs != null && orgs.length == 1) {
            return orgs[0].getAttribute("value").replace("-Development", "");
        }
    }
    return null;
}

function copyToClipboard(pipelineLink) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = pipelineLink;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
};

function createNotification(pipelineName, pipelineLocation) {
    var opt = {
        type: "basic",
        title: "Pipeline Link Copied",
        message: pipelineName,
        contextMessage: pipelineLocation,
        iconUrl: "img/icon-80.png"
    };
    chrome.notifications.create(null, opt, function (notificationId) {
        timer = setTimeout(function () {
            chrome.notifications.clear(notificationId);
        }, 3000);
    });
}

function htmlToDocument(str) {
    // HTML5 <template> allows any element underneath it
    var template = document.createElement("template");
    if (template.content) {
        template.innerHTML = str;
        return template.content;
    }
}