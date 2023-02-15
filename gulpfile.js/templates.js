const { src, dest } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
// модуль для prod таска
const processhtml = require('gulp-processhtml');
const w3cjs = require('gulp-w3cjs');

// для упрощения работы с файлами
const path ={
    dev:'web-page/',
    dist:'dist/'
}

// перемещение файлов из одной папки в другую
function moveHtml(){
    return src(`${path.dev}*.html`)
    .pipe(dest(path.dist))
    .pipe(browserSync.stream());
}
exports.moveHtml = moveHtml;

// для prod тасков
function pathRewrite(){
    return src(`${path.dev}*.html`)
    .pipe(processhtml())
    .pipe(dest(path.dist));
}
exports.pathRewrite =  pathRewrite;

// валидация html кода в проекте без привлечения сторонних средств
function validation(){
    return src(`${path.dev}*.html`)
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
}
exports.validation = validation;

// для prod тасков
function minify(){
    return src(`${path.dist}*.html`)
    .pipe(plumber())
    .pipe(htmlmin({
        collapseWhitespace:true,
        removeComments: true
    }))
    .pipe(dest(`${path.dist}`));
}
exports.minify = minify