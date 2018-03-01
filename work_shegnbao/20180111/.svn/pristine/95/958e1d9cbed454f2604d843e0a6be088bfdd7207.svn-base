var interval = 60000;
var id = undefined;
var projectId = undefined, zoneId = undefined;
var pointList;
var timers = {};
var tmLast;
var userId;

function requestDatasourceData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            postMessage(JSON.parse(xhr.responseText));
            setTimeout(requestDatasourceData, interval);
        }
        else {
            postMessage({ error: '1000' });
        }
    };
    xhr.open("POST", "/analysis/startWorkspaceDataGenPieChart");
    xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.send(JSON.stringify({ dataSourceId: '', dsItemIds: pointList}));
    xhr.send(JSON.stringify({ dsItemIds: pointList }));
}

function messageHandler(e) {
    var type = e.data.type, name;
    pointList = e.data.pointList;
    requestDatasourceData();
}
addEventListener("message", messageHandler, true);