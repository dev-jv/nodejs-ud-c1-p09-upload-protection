const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(':: I´m here..')
});

app.listen(3000, () => {
    console.log('Listening:', 3000);
});
