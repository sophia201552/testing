/** Detect file case problems in *nix
 */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path').posix;
const util = require('util');

const ROOT_PATH = './beopWeb';
const BUNDLE_FILE_ROOT_PATH = ROOT_PATH + '/static';
const BUNDLE_FILE_PATTERN = /bundle[^/]*\.py$/i;
const JS_FILE_PATTERN = /\.js$/i;
const CSS_FILE_PATTERN = /\.css$/i;
const URL_PATTERN = /\(.*?['"]([\w\s]+)['"].*?\)/ig;
const EXCLUDE_PATH = ['node_modules'];

/////////////////// Log ////////////////////
const logFile = fs.createWriteStream(__dirname + '/detect_result.log', {flags : 'w'});
const log = msg => {
    logFile.write(msg + '\n');
    console.info(util.format(msg));
};

/** get variable type */
const getType = v => Object.prototype.toString.call(v)
/** detect RegExp variables */
const isRegexp = v => getType(v) === '[object RegExp]';
/** detect String variables */
const isString = v => getType(v) === '[object String]';

const getAllFilesInDir = (dir, filelist=[]) => {
    let files = fsExtra.readdirSync(dir);
    files.forEach(
        f => {
            if (EXCLUDE_PATH.indexOf(f) > -1) {
                return;
            }
            let stat = fsExtra.statSync(`${dir}/${f}`);
            if (stat.isDirectory()) {
                filelist = getAllFilesInDir(`${dir}/${f}`, filelist);
            } else {
                filelist.push(`${dir}/${f}`);
            }
        }
    )
    return filelist;
}

// get all files
const getFiles = () => {
    // get all files in root path
    let filelist = getAllFilesInDir(ROOT_PATH);
    let js = [], css = [], bundle = [];
    
    filelist.forEach(
        row => {
            if (JS_FILE_PATTERN.test(row)) {
                return js.push(path.relative(BUNDLE_FILE_ROOT_PATH, row))
            }
            if (CSS_FILE_PATTERN.test(row)) {
                return css.push(path.relative(BUNDLE_FILE_ROOT_PATH, row))
            }
            if (BUNDLE_FILE_PATTERN.test(row)) {
                return bundle.push(row)
            }
        }
    );
    //log(js);
    //log(css);
    //log(bundle);

    return {
        js,
        css,
        bundle
    }
}

const detect = () => {
    let files = getFiles();
    let urls = [];
    files.bundle.forEach(
        path => {
            let content = fsExtra.readFileSync(path);
            let bundlePattern = /(?:Bundle\()(.|\r\n)*?(?:output=)/g;
            let urlPattern = /(?:'|")(.+?\.(js|css))(?:'|")/mig;
            let bundleMatch, urlMatch;

            log(`检查文件：${path}`);
            //log(files.js);
            while(bundleMatch = bundlePattern.exec(content)) {
                let bundleContent = bundleMatch[0].replace(/#.*$/mg, '');
                while(urlMatch = urlPattern.exec(bundleContent)) {
                    if (files[urlMatch[2]].indexOf(urlMatch[1]) === -1) {
                        log(`${urlMatch[1]} 未找到`);
                    }
                }
            }
            log('\n');
        }
    )
}

detect();