const { src, dest, series } = require('gulp');
const spritesmith = require('gulp.spritesmith');
const image = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

// для упрощения работы с файлами
const path={
    dev:'web-page/img/',
    dist:'dist/img/',
}

// перемещение графических файлов
// из dev dir в dist dir
// кроме icons - для них будет создан спрайт и 
// кроме файлов препроцессора стилей /sprite/*.scss, 
// применемых для создания спрайта
function moveImage(){
    return src([`${path.dev}**`, `!${path.dev}/icons/`, `!${path.dev}/sprite/*.scss`])
    .pipe(dest(path.dist))
    .pipe(browserSync.stream());
}

exports.moveImage = moveImage;

// создание спрайта для icons/*.png
function sprite(){
    return src(`${path.dev}/icons/*.png`)
    .pipe(plumber())
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        algorithm: 'binary-tree',
        padding: 20
    }))
    .pipe(dest(`${path.dev}sprite/`));
}
exports.sprite = sprite;

// для prod тасков
// минификация изображений
function minimage(){
    return src(`${path.dist}**/*`)
    .pipe(plumber())
    .pipe(image([
        image.svgo({
            plugins: [
                {
                    removeViewBox: true,
                    removeAttrs: true
                }
            ]
        }),
        image.gifsicle({
            plugins:[
                {
                    optimizationLevel:3
                }
            ]
        })
    ], {
        verbose: true
    }))
    .pipe(dest(path.dist));
}

exports.minimage = minimage;