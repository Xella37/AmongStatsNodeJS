
const https = require("https");

const HOSTNAME = "amongstats.net";

let authToken = "";

function userRequest({ request, method = "GET", body = "", authorization = authToken}) {
    if (typeof body === "object")
        body = JSON.stringify(body);

    return new Promise((resolve, reject) => {
        if (authToken.length != 32 && request != "validtoken")
            return reject("Unable to send a user request; no auth token set. Please login first.");

        var options = {
            hostname: HOSTNAME,
            port: 443,
            path: "/api/userdata/" + request,
            method: method,
            headers: {
                "Content-Length": body.length,
                "Authorization": authorization,
            },
        };
        var req = https.request(options, (res) => {
            res.on("data", (d) => {
                let ret = JSON.parse(d);
                if (res.statusCode != 200 && request != "validtoken")
                    return reject(ret.error);
                resolve(ret);
            });
        });

        req.on("error", (e) => {
            reject(e);
        });

        req.write(body);
        req.end();
    });
}

async function validToken(token) {
    let valid = await userRequest({
        request: "validtoken",
        authorization: token,
    });
    return valid;
}

async function addStats(stats) {
    let addStatsResult = await userRequest({
        request: "addstats",
        method: "POST",
        body: {
            stats: stats,
        },
    });
    return addStatsResult;
}

async function login(token) {
    let ret = await validToken(token);
    if (ret.validToken)
        authToken = token;
    else
        throw "Cannot login. Invalid token given.";
}

module.exports = {
    validToken: validToken,
    addStats: addStats,
    login: login,
};
