var gulp = require('gulp')
var nodemon = require('gulp-nodemon');

gulp.task('dev', [],
    function () {
        nodemon({
            script: 'app.js',
            ext: 'js',
            ignore: ['client/*']
        })
            .on('restart',
                function () {
                    console.log('>> node restart ');
                }
            )
    }
);

gulp.task('default', ['dev']);
