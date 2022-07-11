const express = require('express');
const colors = require('colors')
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(keys.mongoURI)
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    )
  } catch (error) {
    console.log(error).red.underline
    process.exit(1)
  }
}
connectDB()

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
console.log('hello')
});

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`.gray.underline );
});
