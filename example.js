
const amongstats = require("./amongstats");

const authToken = "---------TOKEN-GOES-HERE---------";

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
        153, 54, 1807, 94, 218, 161, 140, 75, 8, 96, 392, 488, 469, 10, 26, 4, 245, 39,
    ]);
    console.log(res);

    // Get the latest set of statistics
    let stats = await amongstats.getStats();
    console.log(stats);

    let allStats = await amongstats.getStatsHistory();
    console.log(allStats);
}

start();
