//const testFolder = 'D:/photos';
var router = require('express')();

const imageCollections = require('./image-collections');
const sharp = require('sharp');


router.get('/:collection/list', function (req, res) {
    res.json(imageCollections.get(req.params.collection).keys);
});

router.get('/:collection/action', function (req, res) {
    res.json(imageCollections.get(req.params.collection).actions);
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
