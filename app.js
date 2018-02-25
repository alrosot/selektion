
const express = require('express');
const app = express();


app.use(express.static('client'));

app.use('/services', require('./services'));

app.use('/angular', express.static('node_modules/angular'));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use('/jquery', express.static('node_modules/jquery/dist'));

app.use('/file-saver', express.static('node_modules/file-saver'));

app.use('/popper', express.static('node_modules/popper.js/dist'));

app.listen(process.env.PORT || 3000, function () {
        console.log('Selektion up and running!')
    }
);
