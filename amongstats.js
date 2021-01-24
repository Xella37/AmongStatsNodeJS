
const https = require("https");

const HOSTNAME = "amongstats.net";

let authToken = "";
let applicationCode;

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
            let data

            res.on("data", (chunk) => {
                if (typeof data === "undefined")
                    data = chunk;
                else
                    data += chunk;
            });

            res.on("end", () => {
                try {
                    let ret = JSON.parse(data);
                    if (res.statusCode != 200 && request != "validtoken")
                        return reject(ret.error);
                    resolve(ret);
                } catch(e) {
                    reject("Unable to connect to server. Server might be down.");
                }
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
    return valid.validToken;
}

async function addStats(stats) {
    let addStatsResult = await userRequest({
        request: "addstats",
        method: "POST",
        body: {
            stats: stats,
            application_code: applicationCode,
        },
    });
    return addStatsResult;
}

function processStats(statsRaw) {
    let stats = [];
    for (let i = 0; i < 18; i++)
        stats[i] = statsRaw["stat" + (i+1)];
    return {
        application: statsRaw.application,
        uploaded_on: statsRaw.uploaded_on,
        stats: stats,
    }
}

async function getStats() {
    let addStatsResult = await userRequest({
        request: "stats",
        method: "GET",
    });
    return processStats(addStatsResult.stats);
}

async function getStatsHistory() {
    let addStatsResult = await userRequest({
        request: "statshistory",
        method: "GET",
    });
    return addStatsResult.statshistory.map(processStats);
}

async function getUser() {
    let addStatsResult = await userRequest({
        request: "user",
        method: "GET",
    });
    return addStatsResult.user;
}

async function login(token) {
    let valid = await validToken(token);
    if (valid)
        authToken = token;
    else
        throw "Cannot login. Invalid token given.";
}

async function setApplicationCode(code) {
    applicationCode = code;
}

module.exports = {
    validToken: validToken,
    addStats: addStats,
    getStats: getStats,
    getStatsHistory: getStatsHistory,
    getUser: getUser,
    login: login,
    setApplicationCode: setApplicationCode,
};
