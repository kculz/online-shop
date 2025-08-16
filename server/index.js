const express = require('express');
const app = express();
const port = require('./config').PORT;
const cors = require('cors');
const db = require('./models');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the Online Shop API');
});
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/categories', require('./routes/category.route'));
app.use('/api/products', require('./routes/product.route'));
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/orders', require('./routes/order.route'));

db.sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
