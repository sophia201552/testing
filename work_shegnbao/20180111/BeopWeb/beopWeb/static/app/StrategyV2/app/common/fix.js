import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

if (!Object.values) Object.values = function(obj) {
    if (obj !== Object(obj))
        throw new TypeError('Object.values called on a non-object');
    var val=[],key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj,key)) {
            val.push(obj[key]);
        }
    }
    return val;
}

React.PropTypes = PropTypes;
React.createClass = createReactClass;