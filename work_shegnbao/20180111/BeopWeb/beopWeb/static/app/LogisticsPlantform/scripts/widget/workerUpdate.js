var interval = 300000;
var host = ''

// format Date object to string
// yyyy-mm-dd HH:MM:SS
function _formatDate(d) {
    var year = d.getFullYear();
    var month = d.getMonth();
    var dayMonth = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    month = month < 9 ? '0' + (month + 1) : month % 12 + 1;
    dayMonth = dayMonth < 10 ? '0' + dayMonth : dayMonth;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return [year, month, dayMonth].join('-') + ' ' + [hours, minutes, seconds].join(':');
}

function requestDetailList() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            postMessage(JSON.parse(xhr.responseText));
            setTimeout(requestDetailList, interval);
        } else {
            postMessage({ error: '1000' });
        }
    };
    xhr.open("GET", host + "/logistics/thing/getDataList");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function messageHandler(e) {
    var type = e.data.type;
    switch (type) {
        case 'requestPointDetail':
            requestDetailList();
            break;
    }
}
addEventListener("message", messageHandler, true);