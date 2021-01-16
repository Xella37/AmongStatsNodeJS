
const amongstats = require("./amongstats");

const authToken = "---------TOKEN-GOES-HERE---------";

async function start() {
    // Allow to check the validity of a token
    let valid = await amongstats.validToken(authToken);
    console.log(valid);

    // "Login" saves the auth token
    await amongstats.login(authToken);

    // Add stats to the user's account
    let res = await amongstats.addStats([
        153, 54, 1807, 94, 218, 161, 140, 75, 8, 96, 392, 488, 469, 10, 26, 4, 245, 39,
    ]);
    console.log(res);
}

start();
