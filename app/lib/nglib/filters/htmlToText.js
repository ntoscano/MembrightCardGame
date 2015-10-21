'use strict';
var filtername = 'htmlToText';


module.exports = function(app) {

    var deps = [];

    function filter() {
        return function(text, limit) {
            if (!angular.isString(text)) { return text; }
            // @source: http://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
            var input,
                output,
                elem = document.createElement('div');
            elem.innerHTML = text;
            input = elem.textContent.trim();
            output = input;
            if (limit && output.length > limit) {
                if (limit >= 0) {
                    output = input.slice(0, limit) + '...';
                } else {
                    output = '...' + input.slice(limit, input.length);
                }
            }
            return output;
        }
    }

    filter.$inject = deps;
    app.filter(filtername, filter);
};