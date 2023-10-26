const express = require('express');
const connectDB = require('./utils/connectDB');
const ProductRouter = require('./routes/ProductRouter');
const UserRouter = require('./routes/UserRoutes');
const OrderRouter = require('./routes/OrderRouter');
const UploadRouter = require('./routes/UploadRouter');
const { notFound, errorHandler } = require('./middleware/ErrorMiddlware');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/products', ProductRouter);
app.use('/api/users', UserRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/upload', UploadRouter);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

// Setting the upload file as static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));