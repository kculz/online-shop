const express = require('express');
const app = express();
const port = require('./config').PORT;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the Online Shop API');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});