const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/test', (req, res) => {
    res.send('Test Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});