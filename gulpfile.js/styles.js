const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const combineMediaQuery = require('postcss-combine-media-query');
const del = require('del');
const browserSync = require('browser-sync').create();

// для упрощения работы с файлами
const path ={
    dev:"web-page/styles/main.scss",
    dist:"dist/styles/"
}

// обработка файлов препроцессоров
function scss2css() {
    return src(path.dev)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename('style.css'))      
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest(path.dist))
        .pipe(browserSync.stream());
}
  
exports.scss2css = scss2css;

// для prod тасков
// минификация стилей
function postcss2css() {
    const plugins = [
        autoprefixer(),
        combineMediaQuery(),
        cssnano()
    ];
    return src(`${path.dist}*.css`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(rename('style.min.css'))
        .pipe(dest(path.dist));
}
exports.postcss2css = postcss2css;

// для prod тасков
// удаление файла со старой(не минифицированной) версией стилей
function removeOldStyle(cb){
    del(`${path.dist}style.css`);
    cb();
}
exports.removeOldStyle = removeOldStyle;