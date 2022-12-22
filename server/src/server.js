const { stat } = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const MONGO_URL = ''; // <- Mongo URL goes here
const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connected...');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

mongoose.set("strictQuery", true);

// Have planets data ready, then start server
async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();





