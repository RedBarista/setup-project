var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	browserify = require('gulp-browserify');

var coffeeSources = ['components/coffee/*.coffee'];
var jsSources = ['components/scripts/*.js'];
var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify({ debug: true }))
		.pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			css: 'builds/development/css',
			image: 'builds/development/images',
			style: 'expanded',
			comments: true
		})
		.on('error', gutil.log))
		// Il semblerait que cette ligne de code n'est plus nécessaire puisque compass s'en charge
		// .pipe(gulp.dest('builds/development/css')) 
});

gulp.task('default', ['coffee', 'js', 'compass', 'watch']);

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
});


