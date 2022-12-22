const launchesData = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration',
    rocket: 'Explorer S1',
    launchDate: new Date('December 24, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'SpaceX'],
    upcoming: true,
    success: true, 
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await launchesData.findOne({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesData
        .findOne()
        .sort('-flightNumber'); // Find latest (descendent order)

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    
    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesData
        .find({}, {'_id': 0, '__v':0});
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet found');
    }

    await launchesData.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'SpaceX'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
    const abortedLaunch = await launchesData.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return abortedLaunch.modifiedCount === 1;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};