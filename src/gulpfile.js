var gulp = require('gulp');

/*----------  HTML  ----------*/
    const pug = require('gulp-pug');
/*---------- end of HTML  ----------*/

/*----------  Styles  ----------*/
    const sass = require('gulp-sass');
    const autoprefixer = require('gulp-autoprefixer');
/*----------  end of Styles  ----------*/

/*----------  Scripts  ----------*/
    const babel  = require('gulp-babel');
    const concat   = require('gulp-concat');
    const jshint = require('gulp-jshint');
/*----------  end of Scripts  ----------*/

/*----------  Images  ----------*/
    const sprites  = require('gulp.spritesmith');
    const imagemin = require('gulp-imagemin');
    const pngquant = require('imagemin-pngquant');
    const mozjpeg  = require('imagemin-mozjpeg');
    const webp     = require('gulp-webp');
/*----------  end of Images  ----------*/


/*----------  Utilities  ----------*/
    const merge = require('merge-stream');
    const rename = require("gulp-rename");

    // Browser sync
    const browserSync = require('browser-sync').create();
    const reload      = browserSync.reload();
    const stream      = browserSync.stream();
/*----------  end of Utilities  ----------*/


/*=============================================
=            HTML - Pug            =
=============================================*/

    gulp.task('pug', () => {
        return gulp.src('views/*.pug')
            .pipe(pug({
                doctype: 'html',
                pretty: true
            }))
            .pipe(rename({
                extname : '.php'
            }))
            .pipe(gulp.dest('../'))
    })

/*=====  End of HTML - Pug  ======*/



/*=============================================
=            Sass            =
=============================================*/

    function style() {

        return gulp.src('scss/*.scss')

            .pipe(sass({
                errLogToConsole : true,
                outputStyle     : 'compressed'
            }).on('error', sass.logError))

            .pipe(autoprefixer({
                cascade: false
            }))

            .pipe(gulp.dest('../css'))

            .pipe(stream);

    }

/*=====  End of Sass  ======*/



/*=============================================
=            Javascript            =
=============================================*/

    function scripts() {

        var _babel = 
            gulp.src('js/modules/*.js')
                .pipe(babel({
                    compact  : true,
                    comments : false,
                    presets  : ["@babel/preset-env"],
                    plugins  : ["@babel/plugin-proposal-class-properties"]
                }))
                .pipe(jshint())
                .pipe(gulp.dest('js/babel'));
        
        var base = 
            gulp.src([
                    'js/vendors/*.js', 
                    'js/babel/util.js'
                ])
                .pipe(concat('base.js'))
                .pipe(jshint())
                .pipe(gulp.dest('../js/'))

        
        return merge(_babel, base).pipe(browserSync.stream());

    }

/*=====  End of Javascript  ======*/




/*=============================================
=            Sprites            =
=============================================*/

    function sprite() {

        var spriteData = gulp.src('sprites/*.png').pipe(sprites({
            imgName : 'sprite.png',
            cssName : '_sprites.scss'
        }));
    
        var imgStream = spriteData.img
            .pipe(gulp.dest('../assets/img'));
    
        var cssStream = spriteData.css
            .pipe(gulp.dest('scss/base'));
    
        return merge(imgStream, cssStream);

    }

/*=====  End of Sprites  ======*/



/*=============================================
=            Image min            =
=============================================*/

    function imgmin() {
        return gulp.src('img/*')
            .pipe(imagemin([
                pngquant({quality: [0.9, 0.99]}),
                mozjpeg({quality: 70})
            ]))
            .pipe(gulp.dest('../assets/img'))
            .pipe(webp())
            .pipe(gulp.dest('../assets/img'))
    }

/*=====  End of Image min  ======*/


function watch() {
    browserSync.init({
        proxy: "gulp.loc"
    });

    gulp.watch(['views/**/*.pug'], gulp.series('pug'))
    gulp.watch(['scss/**/*.scss', 'scss/*.scss'], style)
    gulp.watch(['js/**/*.js', '!js/babel/*.js'], scripts), 
    gulp.watch(['../*.html', '../**/*.html', '../*.php', '../**/*.php']).on('change',browserSync.reload);

}

gulp.task('default', gulp.series('pug', style, scripts, watch));
gulp.task('img', gulp.series(imgmin));


exports.style   = style;
exports.scripts = scripts;

exports.sprite  = sprite;

exports.watch   = watch;
