const { 
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model'); 

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    // Validation of data
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing a required property, please try again...',
        });
    }
    // Tranform launchData into a Date object
    launch.launchDate = new Date(launch.launchDate)
    // Validation of date
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Not a valid date...',
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    const launchExists = await existsLaunchWithId(launchId);

    if(!launchExists) {
        return res.status(404).json({
            error: 'Launch not found...',
        });
    }

    const aborted = await abortLaunchById(launchId);

    if(!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted...',
        });
    }
    
    return res.status(200).json({
        ok : true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};
