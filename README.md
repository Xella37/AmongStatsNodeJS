# AmongStatsNodeJS
A NodeJS wrapper for the [Among Stats](https://amongstats.net/) API
The documentation of the API endpoints [API Documentation](https://amongstats.net/api-documentation/)

Installing:
```npm install amongstats```

Require module using
```javascript
const amongstats = require("./amongstats");
```

Module exports:

```javascript
validToken(token)
```
Returns a promise of information on the validity of the given token

```javascript
login(token)
```
Will attempt to "login" by checking the validity of the given token, and if it is valid, it will remember the token for other requests

```javascript
addStats(stats)
```
Returns a promise of information on the success of adding statistics to the user account. ``stats`` is expected to be an array of 18 integers. Example:

```javascript
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
