const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')


const app = express();



// 1) Middleware
app.use(express.json());
app.use(morgan('dev'));





app.get('/', (req, res) => {
  res.send('server running perfectly');
});



// Routes

// tours
app.use('/api/v1/tours',tourRouter );



// users
app.use('/api/v1/users', userRouter);

module.exports = app;