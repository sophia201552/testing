(function ($) {
    var subEvent, pubEvent, unSubEvent, eventMap = {};

    subEvent = function ($obj, topic, fn) {
        if (!$obj) {
            return false;
        }

        $obj.off(topic).on(topic, fn);
        if (eventMap[topic]) {
            eventMap[topic] = $obj;
        } else {
            eventMap[topic] = $obj;
        }
    };

    pubEvent = function (topic, data) {

        if (!eventMap[topic]) {
            return false;
        }

        if (data) {
            eventMap[topic].trigger(topic, $.isArray(data) ? data : [data]);
        } else {
            eventMap[topic].trigger(topic);
        }

        return true;
    };


    unSubEvent = function ($obj, topic) {
        if (!eventMap[topic]) {
            return false;
        }

        eventMap[topic] = eventMap[topic].not($obj);
        if (eventMap[topic].length === 0) {
            delete eventMap[topic];
        }

        return true;
    };
    $.spEvent = {subEvent: subEvent, pubEvent: pubEvent, unSubEvent: unSubEvent};
}(jQuery));