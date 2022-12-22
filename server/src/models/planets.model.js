const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const planets = require('./planets.mongo');

// Filter habitable planets based on Insolation Flux and Planet Size
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
            && planet['koi_insol'] > 0.36 
            && planet['koi_insol'] < 1.11
            && planet['koi_prad'] < 1.6;
}

// Wait for planets data to be resolved, loaded
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'koi_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if(isHabitablePlanet(data)) {
                await upsertPlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const planetsFound = (await getAllPlanets()).length;
            console.log(`Planets found: ${planetsFound}`);
            resolve(); 
        });
    });
}

async function getAllPlanets() {
    return await planets.find({}, {
        // Exclude this filters
        '__v': 0,
        '_id': 0,
    });
}

// Upsert planets data
async function upsertPlanet(planet) {    
    try {
        await planets.updateOne({
            // Update this
            keplerName: planet.kepler_name,
        }, {
            // With this
            keplerName: planet.kepler_name,
        }, {
            // Only add if it doesn't exist 
            upsert: true,
        });
    } catch(err) {
        console.error('Error while saving planet...', err);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};