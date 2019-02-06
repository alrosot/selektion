var gulp = require('gulp')
var nodemon = require('gulp-nodemon');

function dev() {
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


exports.default = dev

