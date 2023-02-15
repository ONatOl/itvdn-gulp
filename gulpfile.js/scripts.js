const { src, dest } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
let uglify = require('gulp-uglify-es').default;
const eslint = require('gulp-eslint');
const del = require('del');
const browserSync = require('browser-sync').create();

// для упрощения работы с файлами
const path = {
    dev:'web-page/scripts/',
    dist:'dist/scripts/'
}

// перемещение скриптов из dev dir в dist dir
function moveScripts(){
    return src(`${path.dev}*.js`)
    .pipe(dest(path.dist))
    .pipe(browserSync.stream());
}

exports.moveScripts = moveScripts;

// проверка скриптов на соответствие lint правилам
function scriptLint(){
    return src(`${path.dev}*.js`)
    .pipe(plumber())
    .pipe(eslint({fix:true}))
    .pipe(eslint.format())
    .pipe(dest(file => file.base))
    .pipe(eslint.failAfterError());
}
exports.scriptLint = scriptLint;

// для prod тасков
// минификация js кода
function jsModify() {
    return src(`${path.dev}*.js`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins:['@babel/plugin-transform-spread']
        }))
		.pipe(concat('index.js'))
		.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename('index.min.js'))
        .pipe(dest(path.dist));
}

exports.jsModify = jsModify;

// для prod тасков
// удаление файла со старой(не минифицированной) версией js кода
function delOldScript(cb){
    del(`${path.dist}index.js`);
    cb();
}
exports.delOldScript = delOldScript;