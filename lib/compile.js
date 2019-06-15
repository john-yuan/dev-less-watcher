var fs = require('fs');
var less = require('less');
var merge = require('x-common-utils/merge');

/**
 * The function to compile the less file.
 *
 * @param {string} filename The filename of the less file.
 * @param {Less.Options} [options] The less options.
 * @returns {Promise} Returns a `Promise`.
 */
function compile(filename, options) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                reject(err);
            } else {
                less.render(data.toString(), merge({}, {
                    filename: filename
                }, options)).then(resolve).catch(reject);
            }
        });
    });
}

module.exports = compile;
