var Archiver = require('archiver');
//const testFolder = 'D:/photos';
var router = require('express')();

var path = require("path");
const imageCollections = require('./image-collections');
const sharp = require('sharp');

router.use(require('body-parser').json());

router.get('/:collection/list', function (req, res) {
    res.json(imageCollections.get(req.params.collection).keys);
});

router.get('/:collection/action', function (req, res) {
    res.json(imageCollections.get(req.params.collection).actions);
});


//TODO actions could be generified
router.post('/:collection/action/download', function (req, res) {

    console.log('Retrieving images: ' + JSON.stringify(req.body));

    // add local file
    var selected = req.body.selected;

    var zip = Archiver('zip');

    zip.pipe(res);
    selected.forEach(image => {
        var localFile = imageCollections.get(1).fileList.get(image);
        zip.file(localFile, {name: path.basename(localFile)});
    });


    var filename = 'album.zip';

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=' + filename
    });

    zip.finalize();


});

router.get('/view/:imageHash', function (req, res) {
    sharp(imageCollections.get(1).fileList.get(req.params.imageHash))
        .resize(null, 980)
        .toBuffer()
        .then(data => {
            res.end(data);
        })
        .catch(err => console.log(err));
});

module.exports = router;
