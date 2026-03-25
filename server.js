const express = require('express');
const path = require('path'); // 👈 solución

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor interno corriendo en el puerto 3000');
});