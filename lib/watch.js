var fse = require('fs-extra');
var chokidar = require('chokidar');
var compile = require('./compile');
var logger = require('@john-yuan/dev-simple-logger');

/**
 * @typedef {Object.<string, *>} DevLessWatcherWatchOptions
 * @property {Less.Options} lessOptions The less options.
 * @property {Object.<string, *>} chokidarOptions The chokidar `WatchOptions`.
 * @property {string|string[]} paths The paths to watch.
 * @property {string} entry The entry path of the less file.
 * @property {string} output The output path of the compiled file.
 */

/**
 * Start a new watcher to complie the less file on file changes.
 *
 * @param {DevLessWatcherWatchOptions} options The watcher options.
 * @returns {FSWatcher} Returns a chokidar `FSWatcher`.
 */
function watch(options) {
    var entry = options.entry;
    var output = options.output;
    var paths = options.paths;
    var chokidarOptions = options.chokidarOptions;
    var lessOptions = options.lessOptions;
    var initBuildExecuted = false;
    var buildId = 0;

    return chokidar.watch(paths, chokidarOptions).on('all', function (event, path) {
        var currentBuildId = null;

        if (event === 'add' && initBuildExecuted) {
            return;
        }

        if (initBuildExecuted) {
            logger.info('build less (' + path + ')');
        } else {
            initBuildExecuted = true;
            logger.info('build less (initial)');
        }

        currentBuildId = (buildId = buildId + 1);

        compile(entry, lessOptions).then(res => {
            if (currentBuildId === buildId) {
                try {
                    fse.outputFileSync(output, res.css);
                } catch (err) {
                    logger.error(err.stack);
                }
            }
        }).catch(err => {
            logger.error(err);
        });
    });
}

module.exports = watch;
