const { series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
// импорт всех тасков, созданных в остальных js файл папки gulpfile.js
const {moveHtml, validation, pathRewrite, minify} = require('./templates');
const {scss2css, postcss2css, removeOldStyle}= require('./styles');
const {moveScripts, scriptLint, jsModify, delOldScript}=require('./scripts');
const {moveImage, sprite, minimage}=require('./images');

// для упрощения работы с файлами
const path={
    html:'web-page/*.html',
    scss:'web-page/styles/*.scss',
    js:'web-page/scripts/*.js',
    dist:'dist/'
}

function cleanOldFiles(cb){
    del(`${path.dist}**`);
    cb();
}

function watcher(){
    // инициализация browserSync
    browserSync.init({
        server: {
            // указываем директорию для работы с файлами
            baseDir: "./dist"
        }
    });
    // вочеры следят за изменениями в папке web-page в соответствующих ф-ах
    // и при их наличии запускают выполнение необходимых тасков с  
    // измененными ф-ми и переносит рез-т в dist папку
    watch(path.scss, series(scss2css));
    watch(path.html, series(moveHtml));
    watch(path.js, series(moveScripts)); 
    // вочер, кот. следит за изменениями в папке dist и при
    // их наличии обновляет веб страницу
    watch(`${path.dist}**/*.*`).on('change', browserSync.reload);
}

// сбор всех тасков вместе; создание и экспорт таска dev
exports.dev= series(cleanOldFiles, moveHtml, sprite, moveImage, moveScripts, scss2css, watcher);
exports.linter= scriptLint;
exports.htmllint= validation;
exports.build=parallel(
    series(postcss2css, removeOldStyle),
    series(jsModify, delOldScript),
    series(pathRewrite, minify),
    series(minimage)
);
