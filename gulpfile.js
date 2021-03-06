var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	jsonminify = require('gulp-jsonminify'),
	browserify = require('gulp-browserify');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development'){
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}


coffeeSources = ['components/coffee/*.coffee'];
jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['builds/development/js/*.json'];

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
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			css: outputDir + 'css',
			image: outputDir + 'images',
			style: sassStyle,
			comments: true
		})
			.on('error', gutil.log))
		.pipe(connect.reload())
	// Il semblerait que cette ligne de code n'est plus nécessaire puisque compass s'en charge
	// .pipe(gulp.dest('builds/development/css'))
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function(){
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('images', function(){
	gulp.src('builds/development/images/**/*.*')
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
		.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src('builds/development/js/*.json')
		.pipe(gulpif(env === 'production', jsonminify()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'js')))
		.pipe(connect.reload())
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'html', 'json', 'images', 'watch']);

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
	gulp.watch(jsonSources, ['json']);
});