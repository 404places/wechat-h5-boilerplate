'use strict';

var autoprefixer = require('gulp-autoprefixer'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    inject = require('gulp-inject'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');



/* ============================================================================================================
============================================ For Development ==================================================
=============================================================================================================*/

// ��δ����ѹ����app/dist/stylesheets/bundle.css��app/dist/javascript/bundle.jsע�뵽app/source/index.html�У�
// �������������app/dist/index.html
gulp.task('inject', function () {
    var target = gulp.src('app/source/index.html');
    var sources = gulp.src([
        'app/dist/stylesheets/bundle.css',
        'app/dist/javascripts/bundle.js'
    ], {
        read: false
    });
    return target
        .pipe(inject(sources, {
            ignorePath: 'app/dist/',
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(gulp.dest('app/dist'));
});

// ��app/source/fonts�ļ��µ������ļ�������app/dist/fonts������������ʹ��
gulp.task('publish-fonts', function () {
    return gulp.src('app/source/fonts/*')
        .pipe(gulp.dest('app/dist/fonts'));
});

// ��app/source/images�ļ��µ������ļ�������app/dist/images������������ʹ��
gulp.task('publish-images', function () {
    return gulp.src('app/source/images/*')
        .pipe(gulp.dest('app/dist/images'));
});

// ��app/source/audios�ļ��µ������ļ�������app/dist/audios������������ʹ��
gulp.task('publish-audios', function () {
    return gulp.src('app/source/audios/*')
        .pipe(gulp.dest('app/dist/audios'));
});

// ����������Ҫ�õ��ĵ�������ʽ���node_modules�п�����app/source/stylesheets
gulp.task('get-css', function () {
    var stylesheets = [
        'node_modules/normalize.css/normalize.css',
        'node_modules/swiper/dist/css/swiper.css'
    ];

    return gulp.src(stylesheets)
        .pipe(gulp.dest('app/source/stylesheets'));
});

//  ��sass��app/sass������Ϊapp/source/stylesheets/compiled-style.css
gulp.task('compile-sass', function () {
    return gulp.src('app/source/sass/main.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename('compiled-style.css'))
        .pipe(gulp.dest('app/source/stylesheets'));
});

// ���������õ���������ʽ��app/source/stylesheets/*���ϲ�Ϊһ���ļ�app/dist/stylesheets/bundle.css
gulp.task('concat-css', function () {
    var stylesheets = [
        'app/source/stylesheets/*'
    ];

    return gulp.src(stylesheets)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('app/dist/stylesheets'))
        .pipe(browserSync.stream());
});

// ʹ��browserify������CommonJSģ������һ���ļ�app/dist/javascript/bundle.js
gulp.task('browserify', function () {
    return gulp.src('app/source/javascripts/main.js')
        .pipe(browserify({
            transform: ['partialify'],
            debug: true
        }))
        .on('error', function (err) {
            console.log(err.message);
            this.end();
        })
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('app/dist/javascripts'));
});

// ����ļ������ļ����������޸ĺ�ɾ��ʱ���Զ�ִ����ص�����ˢ�������
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: 'app/dist'
        }
    });

    // ��ʹ�����·��, �����ļ���������ɾ��ʱgulp.watch���ᱻ����
    gulp.watch('app/source/index.html', ['inject']);
    gulp.watch('app/source/sass/**/*', ['compile-sass']);
    gulp.watch('app/source/stylesheets/**/*.css', ['concat-css']);
    gulp.watch('app/source/javascripts/**/*', ['browserify']);
    gulp.watch('app/source/fonts/**', ['publish-fonts']);
    gulp.watch('app/source/images/**', ['publish-images']);
    gulp.watch('app/source/audios/**', ['publish-audios']);

    gulp.watch('app/dist/index.html').on('change', browserSync.reload);
    gulp.watch('app/dist/javascripts/*').on('change', browserSync.reload);
    gulp.watch('app/dist/fonts/*').on('change', browserSync.reload);
    gulp.watch('app/dist/images/*').on('change', browserSync.reload);
});

// ɾ��app/dist�µ������ļ�
gulp.task('clean-dist', function(cb) {
    return del([
        'app/dist/**/*'
    ], cb)
});

// Ĭ������
gulp.task('default', function (cb) {
    runSequence(['clean-dist', 'get-css', 'compile-sass'], ['publish-fonts', 'publish-images', 'publish-audios', 'concat-css', 'browserify'], 'inject', 'watch', cb);
});



/* ============================================================================================================
================================================= For Production ==============================================
=============================================================================================================*/

// ѹ��app/dist/stylesheets/bundle.css�����������Ϊapp/dist/stylesheets/bundle.min.css
gulp.task('minify-css', function () {
    return gulp.src('app/dist/stylesheets/bundle.css')
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/dist/stylesheets'));
});

// ѹ��app/dist/javascripts/bundle.js�����������Ϊapp/dist/javascripts/bundle.min.js
gulp.task('uglify-js', function () {
    return gulp.src('app/dist/javascripts/bundle.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/dist/javascripts'));
});

// ������ѹ����app/dist/stylesheets/bundle.min.css��app/dist/javascript/bundle.min.jsע�뵽app/source/index.html�У�
// ������������� app/dist/index.html
gulp.task('inject-min', function () {
    var target = gulp.src('app/source/index.html');
    var sources = gulp.src([
        'app/dist/stylesheets/bundle.min.css',
        'app/dist/javascripts/bundle.min.js'
    ], {
        read: false
    });
    return target
        .pipe(inject(sources, {
            ignorePath: 'app/dist/',
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(gulp.dest('app/dist'));
});

// ɾ��δ��ѹ����app/dist/stylesheets/bundle.css��app/dist/javascripts/bundle.js
gulp.task('del-bundle', function (cb) {
    return del([
        'app/dist/stylesheedts/bundle.css',
        'app/dist/javascripts/bundle.js'
    ], cb);
});

// ������������'minify-css'��'uglify-js'��'inject-min'
gulp.task('prod',  function (cb) {
    runSequence(['minify-css', 'uglify-js'], ['inject-min', 'del-bundle'], cb);
});
