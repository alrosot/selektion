var dir = require('node-dir');
var md5 = require('md5');

var path = require("path");

var collections = [{
    key: 1,
    name: "Test Images",
    actions: [{key: "download", label: "Download as zip file"}],
    root: "test/imgsamples"
}];

const allowedExtensions = ["jpg", "jpeg", "bmp", "png", "gif"];

collections.forEach(collection => {

    dir.files(collection.root,
        function (err, files) {
            if (err) throw err;
            var paths = files.map(file => path.resolve(file));
            var map = new Map();
            paths.forEach(path => {
                if (allowedExtensions.indexOf(path.split('.').pop().toLocaleLowerCase()) >= 0) {
                    map.set(md5(path), path);
                }
            });
            collection.fileList = map;
            collection.keys = Array.from(map.keys());
        });
});
console.log("All files indexed")

module.exports.get = function (key) {
    for (var i = 0; i < collections.length; i++) {
        if (collections[i].key == key) {
            return collections[i];
        }
    }
}

module.exports.getAll = function () {
    return collections;
};