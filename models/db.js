const mongoose = require('mongoose');
const mongoURI = require('../config.json').mongoURI;
// Allow Promises
mongoose.Promise = global.Promise;
// Connection
mongoose.connect(mongoURI, { useNewUrlParser: true })
// mongoose.connect('mongodb://germancutraro:germancutraro33@ds131551.mlab.com:31551/crud-mern', { useNewUrlParser: true });
// Validation
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection
  .once('open', () => console.log('Connected to the database!'))
  .on('error', err => console.log('Error with the database!', err));
