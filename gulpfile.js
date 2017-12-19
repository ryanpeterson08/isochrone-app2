var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var del = require('del');
var browserSync = require('browser-sync').create();
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
}
);



gulp.task('jsBrowserify', function(){
  return browserify({entries: ['public/js/isochrone.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./public/build/js'));
});

// gulp.task('minifyScripts', ['jsBrowserify'], function(){
//   return gulp.src('./build/js/app.js')
//   .pipe(uglify())
//   .pipe(gulp.dest("./build/js"));
// });


gulp.task('bowerJS', function(){
  return gulp.src(lib.ext('js').files)
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest('./public/build/js'));
});

// gulp.task('bowerCSS', function(){
//   return gulp.src(lib.ext('.css').files)
//   .pipe(concat('vendor.css'))
//   .pipe(gulp.dest('./build/css'));
// });

gulp.task('bower', ['bowerJS']);

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('clean', function(){
  return del(['build']);
});

gulp.task('build', ['clean'], function(){
  gulp.start('jsBrowserify');
  gulp.start('bower');
});


gulp.task('serve', function(){
  browserSync.init({
    server:{
      baseDir: './views',
      index: 'index.esj'
    }
  });
  gulp.watch(['js/*.js'], ['build']);
});
