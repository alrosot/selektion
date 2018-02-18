const testFolder = 'test/imgsamples';
//const testFolder = 'D:/photos';
var router = require('express')();
var dir = require('node-dir');
var md5 = require('md5');
var path = require("path");
const sharp = require('sharp');

const allowedExtensions = ["jpg", "jpeg", "bmp", "png", "gif"];

var fileList;


router.get('/list', function (req, res) {
    if (fileList) {
        res.json(Array.from(fileList.keys()));
        return;
    }
    console.log("Retrieving files");

    dir.files(testFolder,
        function (err, files) {
            if (err) throw err;
            var paths = files.map(file => path.resolve(file));
            var map = new Map();
            paths.forEach(path => {
                if (allowedExtensions.indexOf(path.split('.').pop().toLocaleLowerCase()) >= 0) {
                    map.set(md5(path), path);
                }
            });
            fileList = map;
            var imgHashesArray = Array.from(fileList.keys());
            res.json(imgHashesArray);
            console.log(imgHashesArray.length);
            console.log("Done!");
        });
});

router.get('/view/:imageHash', function (req, res) {
    sharp(fileList.get(req.params.imageHash))
        .resize(null,980)
        .toBuffer()
        .then(data => {
            res.end(data);
        })
        .catch(err => console.log(err));
});

module.exports = router;
