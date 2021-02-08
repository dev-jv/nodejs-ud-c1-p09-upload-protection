require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use (bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use( require('./routes/index') );

mongoose.connect(process.env.KDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos ONLINE')
});

app.listen(process.env.PORT, () => {
    console.log('Listening:', process.env.PORT);
});
