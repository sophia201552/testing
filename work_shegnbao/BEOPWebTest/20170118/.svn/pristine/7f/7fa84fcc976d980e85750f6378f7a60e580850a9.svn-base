(function (beop) {
    var configMap = {
            host: '192.168.1.96',
            port: '5001'
        },
        stateMap = {
            socket: null
        };
    var init, enterProject, exitProject, changeProject, connect;

    init = function () {
        stateMap.socket = io.connect('//' + configMap.host + ':' + configMap.port);
    };

    enterProject = function (id) {
        if (!id) {
            return false;
        }
        stateMap.socket.emit('enter project', id, function (message) {
            console.log(message);
        });

        stateMap.socket.on('message', function (msg) {
            console.log('message: ' + msg);
        });
    };

    exitProject = function (id) {
        stateMap.socket.emit('exit project', id, function (message) {
            console.log(message);
        });
    };

    changeProject = function (oldId, newId) {
        exitProject(oldId);
        enterProject(newId);
    };

    connect = function () {
        stateMap.socket.on('connect', function (message) {

        })
    };


//---------Exports---------
    beop.ws = beop.ws || {};

    beop.ws = {
        init: init,
        enterProject: enterProject,
        exitProject: exitProject,
        connect: connect
    };
}(beop || (beop = {})));
