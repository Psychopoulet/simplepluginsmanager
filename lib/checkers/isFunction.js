"use strict";

// module

module.exports = function isFunction (dataName, data) {

	if ("undefined" === typeof data) {
		return Promise.reject(new ReferenceError("\"" + dataName + "\" parameter is missing"));
	}
		else if ("function" !== typeof data) {
			return Promise.reject(new TypeError("\"" + dataName + "\" parameter is not a function"));
		}

	else {
		return Promise.resolve();
	}

};
