'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync"),
    spritesmith = require('gulp.spritesmith'),
    notify = require('gulp-notify'),
    pug = require('gulp-pug'),
    fs = require('fs'),
    // svgSprite = require('gulp-svg-sprite'),
    reload = browserSync.reload;

var path = {
    prod: {
      html: 'prod/',
      js: 'prod/js/',
      css: 'prod/css/',
      img: 'prod/images/',
      fonts: 'prod/fonts/'
    },
    src: {
      js: 'src/js/*.js',
      js_vendor: 'src/js/vendor/*.js',
      md: 'src/js/modernizr.js',
      style: 'src/style/**/*.scss',
      img: 'src/images/img/*.*',
      favicon: 'src/favicon/*.*',
      fonts: 'src/fonts/**/*.*',
      pug: 'src/pug/*.pug',
      sprite: 'src/images/ico/*.*'
    },
    watch: {
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      img: 'src/images/img/*.*',
      fonts: 'src/fonts/**/*.*',
      pug: 'src/pug/**/*.pug',
      sprite: 'src/images/ico/*.*'
    },
    dev: {
      html: 'dev/',
      js: 'dev/js/',
      js_vendor: 'dev/js/vendor/',
      css: 'dev/',
      img: 'dev/images/',
      favicon: 'dev/favicon/',
      fonts: 'dev/fonts/'
    },
    clean: './prod',
    clean_dev: './dev/'

};

var config_prod = {
  server: {
      baseDir: ["./prod"]
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000
};

var config_dev = {
  server: {
      baseDir: ["./dev"]
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000
};

gulp.task('webserver_prod', function () {
  browserSync.init(config_prod);
});

gulp.task('webserver_dev', function () {
  browserSync(config_dev);
});


gulp.task('html:prod', function () {
  var YOUR_LOCALS = {};
  gulp.src(path.src.pug)
    .pipe(pug({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(path.prod.html))
    .pipe(reload({stream: true}));
});

gulp.task('html:dev', function () {
    var YOUR_LOCALS = './src/pug/template/content.json';
    gulp.src(path.src.pug)
    .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'pug',
          message: err.message
        }))
      }))
    .pipe(pug({
      locals: JSON.parse(fs.readFileSync(YOUR_LOCALS, 'utf8')),
      pretty: true
    }))
    .pipe(gulp.dest(path.dev.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:prod', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.prod.js))
    .pipe(reload({stream: true}));
});

gulp.task('js:dev', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.dev.js));
});

gulp.task('js:dev_vendor', function () {
    gulp.src(path.src.js_vendor)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.dev.js_vendor));
});

// gulp.task('md:prod', function () {
//   gulp.src(path.src.md)
//     .pipe(rigger())
//     .pipe(uglify())
//     .pipe(gulp.dest(path.prod.js))
//     .pipe(reload({stream: true}));
// });

// gulp.task('md:dev', function () {
//   gulp.src(path.src.md)
//     .pipe(rigger())
//     .pipe(gulp.dest(path.dev.js))
//     .pipe(reload({stream: true}));
// });

gulp.task('style:prod', function () {
  gulp.src(path.src.style)
    .pipe(sass({
        includePaths: ['src/style/'],
        outputStyle: 'compressed',
        sourceMap: true,
        errLogToConsole: true

    }))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(path.prod.css))
    .pipe(reload({stream: true}));
});


gulp.task('style:dev', function () {
  gulp.src(path.src.style)
    .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'Styles',
          message: err.message
        }))
      }))
    .pipe(sass())
    // .pipe(sourcemaps.init())
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dev.css))
    .pipe(reload({stream: true}));
});


gulp.task('image:prod', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.prod.img))
    .pipe(reload({stream: true}));
});

gulp.task('image:dev', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.dev.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:prod', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.prod.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:dev', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dev.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../images/sprite.png',
    padding: 10
  }));
    spriteData.img.pipe(gulp.dest('src/images/img/'));
    spriteData.css.pipe(gulp.dest('src/style/partials/'));
});


// gulp.task('sprite', function () {
//   var configSvg  = {
//     "shape": {
//         "spacing": {
//             "padding": 10
//         }
//     },
//     "svg": {
//         "namespaceIDs": false,
//         "dimensionAttributes": false
//     },
//     "mode": {
//         "view": {
//             "dest": "src/images/img/",
//             "sprite": "sprite.svg",
//             "bust": false,
//             "render": {
//                 "scss": {
//                     "dest": "../../style/partials/sprite.scss"
//                 }
//             }
//         }
//     }
// };

//   gulp.src(path.src.sprite)
//     .pipe(svgSprite(configSvg))
//     .pipe(gulp.dest('./'));
// });



// Фавиконки
gulp.task('favicon', function () {
    gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.dev.favicon))
        .pipe(reload({stream: true}));
});


// Картинки сжатие
gulp.task('img', function() {
    return gulp.src('src/images/**/**/**')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true}))
        .pipe(gulp.dest('src/images/'));
});




gulp.task('prod', [
  'html:prod',
  'style:prod',
  'js:prod',
  // 'md:prod',
  'fonts:prod',
  'image:prod',
  'sprite'
]);

gulp.task('dev', [
  'html:dev',
  'style:dev',
  'js:dev',
  'js:dev_vendor',
  // 'md:dev',
  'fonts:dev',
  'image:dev',
  'sprite'
]);


gulp.task('watch', function(){
    watch([path.watch.pug], function (event, cb) {
        gulp.start('html:prod');
    });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:prod');
    });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:prod');
    // gulp.start('md:prod');
    });
  watch([path.watch.sprite], function(event, cb) {
    gulp.start('sprite');
    });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:prod');
    });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:prod');
    });
});

gulp.task('watch_dev', function(){
  watch([path.watch.pug], function(event, cb) {
    gulp.start('html:dev');
    });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:dev');
    });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:dev');
    gulp.start('js:dev_vendor');
    // gulp.start('md:dev');
    });
  watch([path.watch.sprite], function(event, cb) {
    gulp.start('sprite');
    });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:dev');
    });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:dev');
    });
});




// Удаление папки prod

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});


// Удаление папки dev

gulp.task('clean_dev', function (cb) {
  rimraf(path.clean_dev, cb);
});


// Папка на продакшн(prod)

gulp.task('pr', ['prod', 'webserver_prod', 'watch']);


// Папка для работы(dev)

gulp.task('default', ['dev', 'webserver_dev', 'watch_dev']);