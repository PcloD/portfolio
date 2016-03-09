var con = console;

var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var jade = require('gulp-jade');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

function compile(watch) {

  var bundler = browserify(['./src/js/folio.js'], { debug: true }).transform(babel);
  if (watch) {
    bundler = watchify(bundler);
  }

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(source('folio.js'))
      .pipe(buffer())
      .pipe(uglify())
      // .pipe(sourcemaps.init({ loadMaps: true }))
      // .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest("deploy/"));

    compileJade();
    compileStylus();
    copyImages();

  }

  if (watch) {

    gulp.watch(['src/**/*.jade'], ['compileJade']);
    gulp.watch('src/css/*.styl', ['compileStylus']);
    gulp.watch(['src/images/**/*'], {}, ['copyImages']);

    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  con.log("watch");
  return compile(true);
};

function compileJade() {
  con.log("compileJade");
  return gulp.src('src/jade/*.jade')
    .pipe(jade({
      pretty: true,
      data: {
        siteTitle: "title"
      }
    }))
    .pipe(gulp.dest('deploy/'));
}

function compileStylus() {
  return gulp.src('src/css/*.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('deploy/css/'));
}

function copyImages() {
  return gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('deploy/images/'));
}

gulp.task('compileJade', function() {
  compileJade();
});

gulp.task('compileStylus', function() {
  compileStylus();
});

gulp.task('copyImages', function() {
  copyImages();
});

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);