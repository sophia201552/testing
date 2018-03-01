var interval = 60000;
var id = undefined;
var projectId = undefined;
var pointList;
var timers = {};

function requestData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            postMessage(JSON.parse(xhr.responseText));
            setTimeout(requestData, interval);
        }
        else {
            postMessage({ error: '1000' });
        }
    };
    xhr.open("POST", "/get_realtimedata");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ proj: projectId, pointList: pointList }));
}

function requestDiagnosisNotices() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            postMessage(JSON.parse(xhr.responseText));
            setTimeout(requestDiagnosisNotices, 600000);
        }
        else {
            postMessage({ error: '1000' });
        }
    };
    xhr.open("GET", "/diagnosis/notice/get/" + projectId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

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

var requestAlarmData = (function () {
    // format Date object to string
    // yyyy-mm-dd HH:MM:SS
    function _formatDate(d) {
        var year     = d.getFullYear();
        var month    = d.getMonth();
        var dayMonth = d.getDate();
        var hours    = d.getHours();
        var minutes  = d.getMinutes();
        var seconds  = d.getSeconds();

        month    = month < 10 ? '0'+(month+1) : month+1;
        dayMonth = dayMonth < 10 ? '0'+dayMonth : dayMonth;
        hours    = hours < 10 ? '0'+hours : hours;
        minutes  = minutes < 10 ? '0'+minutes : minutes;
        seconds  = seconds < 10 ? '0'+seconds : seconds;

        return [year, month, dayMonth].join('-') + ' ' + [hours, minutes, seconds].join(':');
    }

    function requestAlarmData() {
        var xhr = new XMLHttpRequest();
        // get the last 1 minute alarm info
        var startTime = _formatDate(new Date(new Date().valueOf()-60*1000));
        var endTime = '2035-01-01 00:00:00';
        // post "loading" event
        postMessage({ status: 'LOADING', msg: 'loading' });
        xhr.onload = function () {
            var data;
            if (xhr.status == 200) {
                // filter alarm list by localStorage.alarm_rules
                postMessage({status: 'OK', msg: 'success', data: JSON.parse(xhr.responseText)});
                timers['dataAlarmRealtime'] = setTimeout(requestAlarmData, 300000);
            }
            else {
                postMessage({ status: 'FAILD', msg: 'faild' });
            }
        };
        xhr.open("GET", "/warning/getRecord/"+projectId+
            '?startTime='+encodeURIComponent(startTime)+'&endTime='+encodeURIComponent(endTime));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ startTime: startTime, endTime: endTime}));
    }

    return requestAlarmData;
} ());

function messageHandler(e) {
    var type = e.data.type, name;
    switch(type) {
        case 'dataRealtime':
            projectId = e.data.projectId;
            id = e.data.id;
            pointList = e.data.pointList;
            requestData();
            break;
        case 'diagnosisScreen':
            projectId = e.data.projectId;
            requestDiagnosisNotices();
            break;
        case 'datasourceRealtime':
            pointList = e.data.pointList;
            requestDatasourceData();
            break;
        case 'dataAlarmRealtime':
            // ensure there is only one timer running at one time
            if( timers[type] ) {clearTimeout(timers[type]);timers[type]=null;}
            projectId = e.data.projectId;
            requestAlarmData();
            break;
        case 'clearTimer':
            name = e.data.name;
            if(timers[name]) {clearTimeout(timers[name]);timers[name]=null;}
            break;
    }
}
addEventListener("message", messageHandler, true);