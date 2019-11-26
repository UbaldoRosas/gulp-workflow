var gulp = require('gulp');

var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
var concat = require('gulp-concat');
const jshint = require('gulp-jshint');

var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var stream      = browserSync.stream;

function handleError (error) {
    console.log(error.toString());
    this.emit('end');
}


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

            .pipe(browserSync.stream());

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
                .on('error', handleError)
                .pipe(jshint())
                .pipe(gulp.dest('js/babel'));
        
        var base = 
            gulp.src([
                    'js/vendors/*.js', 
                    'js/babel/util.js'
                ])
                .pipe(concat('base.js'))
                .on('error', handleError)
                .pipe(jshint())
                .pipe(gulp.dest('../js/'))
        
        return merge(_babel, base).pipe(browserSync.stream());
    }

/*=====  End of Javascript  ======*/




/*=============================================
=            Sprites            =
=============================================*/

    function sprite() {
        var spriteData = gulp.src('sprites/*.png').pipe(spritesmith({
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




function watch() {
    browserSync.init({
        proxy: "gulp.loc"
    });

    gulp.watch(['scss/**/*.scss', 'scss/*.scss'], style)
    gulp.watch(['js/**/*.js', '!js/babel/*.js'], scripts), 
    gulp.watch(['../*.html', '../**/*.html', '../*.php', '../**/*.php']).on('change',browserSync.reload);

}

gulp.task('default', gulp.series(style, scripts, watch));


exports.style   = style;
exports.scripts = scripts;
exports.sprite  = sprite;
exports.watch   = watch;
