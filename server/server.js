require('./config/config'); // ...

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');

// ------------------------------------------------ <> parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// -------------------------- <> parse application/json
app.use (bodyParser.json());

// ---------------------------------------------------------- <> Habilitar el file public
app.use(express.static(path.resolve(__dirname, '../public')));

// ---------------------------------- <> Global route!
app.use( require('./routes/index') ); // ...

// ----------------------------------------- <> Conection DB + options
mongoose.connect(process.env.KDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('ONLINE Database')
});

// ------------------------------------- <> PORT
app.listen(process.env.PORT, () => {
    console.log('Listening:', process.env.PORT);
});
