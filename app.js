const path = require('path');
const express = require('express');
const app = express();


app.use(express.static('client'));

app.use('/services', require('./services'));

app.use('/angular', express.static('node_modules/angular'));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use('/jquery', express.static('node_modules/jquery/dist'));

app.use('/file-saver', express.static('node_modules/file-saver'));

app.use('/popper', express.static('node_modules/popper.js/dist'));

app.use(express.static(path.join(__dirname, 'tomato/build')));

app.get('/tomato', function(req, res) {
    res.sendFile(path.join(__dirname, 'tomato/build', 'index.html'));
});

var server = app.listen(process.env.PORT || 3000, function () {
        console.log('Selektion up and running!')
    }
);

// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
    'SIGHUP': 1,
    'SIGINT': 2,
    'SIGTERM': 15
};
// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
    console.log("shutdown!");
    server.close(() => {
        console.log(`server stopped by ${signal} with value ${value}`);
        process.exit(128 + value);
    });
};
// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
        console.log(`process received a ${signal} signal`);
        shutdown(signal, signals[signal]);
    });
});