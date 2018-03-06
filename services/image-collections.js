var dir = require('node-dir');
var md5 = require('md5');

var path = require("path");

var collectionId = 0;

var collections = [{
    key: ++collectionId,
    name: "Test Images",
    actions: [{key: "download", label: "Download as zip file"}],
    root: "test/imgsamples"
}];

const allowedExtensions = ["jpg", "jpeg", "bmp", "png", "gif"];

collections.forEach(collection => {

    dir.files(collection.root,
        function (err, files) {

            var scannedNames = new Map();
            var duplicateFilesByName = new Set();

            if (err) throw err;
            var paths = files.map(file => path.resolve(file));
            var map = new Map();
            paths.forEach(filePath => {
                if (allowedExtensions.indexOf(filePath.split('.').pop().toLocaleLowerCase()) >= 0) {
                    map.set(md5(filePath), filePath);
                    var fileName = path.basename(filePath);
                    if (scannedNames.has(fileName)) {
                        duplicateFilesByName
                            .add(filePath)
                            .add(scannedNames.get(fileName));


                    } else {
                        scannedNames.set(fileName, filePath);
                    }
                }
            });
            collection.fileList = map;
            collection.keys = Array.from(map.keys());

            if (duplicateFilesByName.size > 0) {
                console.log("Found some files with the same name");
                duplicateFilesByName.forEach(value => console.log(value));

                var fileList = new Map();
                duplicateFilesByName.forEach(value => fileList.set(md5(value), value));

                collections.push({
                    key: ++collectionId,
                    name: "Duplicates of " + collection.name,
                    actions: [{key: "delete", label: "Delete selected"}],
                    fileList: fileList,
                    keys: Array.from(fileList.keys())
                });
            }
        });
});

module.exports.get = function (key) {
    for (var i = 0; i < collections.length; i++) {
        if (collections[i].key == key) {
            return collections[i];
        }
    }
};

module.exports.getAll = function () {
    return collections;
};