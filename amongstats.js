
const https = require("https");

const HOSTNAME = "amongstats.net";

let applicationCode;

function apiRequest(request, options, authorization) {
    let method = options && options.method || "GET";
    let body = options && options.body || "";

    if (typeof body === "object")
        body = JSON.stringify(body);

    return new Promise((resolve, reject) => {
        if (authorization.length != 32 && request != "validtoken")
            return reject("Unable to send a request; no auth token set. Please login first.");

        var options = {
            hostname: HOSTNAME,
            port: 443,
            path: "/api/" + request,
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

function processUserStats(statsRaw) {
    let stats = [];
    for (let i = 0; i < 18; i++)
        stats[i] = statsRaw["stat" + (i+1)];
    return {
        application: statsRaw.application,
        uploaded_on: statsRaw.uploaded_on,
        user: statsRaw.user,
        username: statsRaw.username,
        max_crewmate_streak: statsRaw.max_crewmate_streak,
        stats: stats,
    }
}

class UserClient {
    constructor() {}

    request(request, reqData, auth=this.token) {
        return apiRequest("userdata/" + request, reqData, auth);
    }

    // Checks the validity of a token
    async validToken(token) {
        let valid = await this.request("validtoken", {}, token);
        return valid.validToken;
    }

    // Checks if token is valid and saves it for future requests
    async login(token) {
        let valid = await this.validToken(token);
        if (valid)
            this.token = token;
        else
            throw "Cannot login. Invalid token given.";
    }

    // Returns basic information on the Discord user like username, avatar code and when the AmongStats account was created
    async getInfo() {
        let userResult = await this.request("user");
        return userResult.user;
    }

    // Adds statistics to the users account. stats has to be an array of 18 integers
    async addStats(stats) {
        let addStatsResult = await this.request("addstats", {
            method: "POST",
            body: {
                stats: stats,
                application_code: applicationCode,
            },
        });
        return addStatsResult;
    }

    // Returns the most recent statistics of the user
    async getStats() {
        let addStatsResult = await this.request("stats");
        return processStats(addStatsResult.stats);
    }

    // Returns all of the users uploaded statistics
    async getStatsHistory() {
        let historyResult = await this.request("statshistory");
        return historyResult.statshistory.map(processStats);
    }
}

class GuildClient {
    constructor() {}

    request(request, reqData, auth=this.token) {
        return apiRequest("guilddata/" + request, reqData, auth);
    }

    // Checks the validity of a token
    async validToken(token) {
        let valid = await this.request("validtoken", {}, token);
        return valid.validToken;
    }

    // Checks if token is valid and saves it for future requests
    async login(token) {
        let valid = await this.validToken(token);
        if (valid)
            this.token = token;
        else
            throw "Cannot login. Invalid token given.";
    }

    // Returns basic information on the Discord guild like id, name, icon code, command_prefix, owner, joined_on, screenshot_channel
    async getInfo() {
        let userResult = await this.request("guild");
        return userResult.guild;
    }

    // Returns a list of all the users in the guild with an account, along with their hidden status
    async getUsers() {
        let userResult = await this.request("users");
        return userResult.users;
    }

    // Returns basic information on a single user
    async getUser(userId) {
        let userResult = await this.request("user/" + userId);
        return userResult.user;
    }

    // Returns the most recently uploaded statistics from the given user
    async getUserStats(userId) {
        let statsResult = await this.request("userstats/" + userId);
        return processStats(statsResult.stats);
    }

    // Returns all uploaded statistics from the given user
    async getUserStatsHistory(userId) {
        let statsResult = await this.request("userstatshistory/" + userId);
        return statsResult.stats.map(processStats);
    }

    // Returns the most recently uploaded statistics from all users in the guild with an account
    async getStats() {
        let statsResult = await this.request("stats");
        return statsResult.stats.map(processUserStats);
    }

}

async function setApplicationCode(code) {
    applicationCode = code;
}

module.exports = {
    UserClient: UserClient,
    GuildClient: GuildClient,
    setApplicationCode: setApplicationCode,
};
