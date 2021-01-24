
const amongstats = require("./amongstats");

const applicationCode = "27b3ef8b64bcb7fd479ea652849c8461";
const authToken = "d45d697631023102ae1cbcdb689fa4d6"; //"---------TOKEN-GOES-HERE---------";

// Set the application code
amongstats.setApplicationCode(applicationCode);

async function start() {
    // Allow to check the validity of a token
    let valid = await amongstats.validToken(authToken);
    console.log(valid);

    // "Login" saves the auth token
    await amongstats.login(authToken);

    // Receive basic information on the user
    let user = await amongstats.getUser();
    console.log(user);

    // Add stats to the user's account
    let res = await amongstats.addStats([
        158, 58, 1807, 94, 218, 161, 140, 75, 8, 96, 392, 488, 469, 10, 26, 4, 245, 39,
    ]);
    console.log(res);

    // Get the latest set of statistics
    let stats = await amongstats.getStats();
    console.log(stats);

    // Get all the statistics uploaded by the user
    let allStats = await amongstats.getStatsHistory();
    console.log(allStats);
}

start();
