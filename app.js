const express = require('express');
const app = express();

const { NotFoundError} = require('./ExpressErrors');
const cors = require('cors');
const {authenticateJWT} = require('./middleware/auth');

app.use(express.json());

app.use(cors());
app.use(authenticateJWT);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const weatherRoutes = require('./routes/weather');
const noteRoutes = require('./routes/notes');
const newsRoutes = require('./routes/news');
const calendarRoutes = require('./routes/calendar');
const cryptoRoutes = require('./routes/crypto');

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/users', userRoutes);
app.use('/weather', weatherRoutes);
app.use('/news', newsRoutes);
app.use('/calendar', calendarRoutes);
app.use('/crypto', cryptoRoutes);

app.use((req, res, next) =>{
    return next(new NotFoundError());
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;