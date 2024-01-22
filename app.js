require('dotenv').config();
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Middle wares
app.use(morgan('dev'))
app.use(express.json());

const port = process.env.PORT || 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'natours is server running' });
});

// Route handlers

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  //   if (id > tours.length) {
  //     return res.status(404).json({ status: 'failed', message: 'invalid id' });
  //   }
  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'invalid id' });
  }

  res.status(200).send(tour);
};

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {}
  );

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'invalid id' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<>Update your tour here......</>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'invalid id' });
  }

  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

const getAllUsers = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}


// Routes

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

// start server

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
