# AmongStatsNodeJS
A NodeJS wrapper for the [Among Stats](https://amongstats.net/) API.
The documentation of the API endpoints: [API Documentation](https://amongstats.net/api-documentation/)

Installing:
```npm install amongstats```

Require module using
```javascript
const amongstats = require("amongstats");
```

Module exports:

```javascript
let user = new amongstats.UserClient();
```
Returns a new user client that can be used to login and access user data.

```javascript
let guild = new amongstats.GuildClient();
```
Returns a new guild client that can be used to login and access guild data.

```javascript
user.login(userToken);
```
Will attempt to "login" by checking the validity of the given token, and if it is valid, it will remember the token for other requests. Token generated using the [Discord bot](https://top.gg/bot/770639689136865331) command ``;generatetoken``.

```javascript
guild.login(guildToken);
```
Will attempt to "login" by checking the validity of the given token, and if it is valid, it will remember the token for other requests. Token generated using the [Discord bot](https://top.gg/bot/770639689136865331) command ``;generateguildtoken``.

```javascript
amongstats.setApplicationCode(applicationCode);
```
Sets the application code for uploading statistics. This is optiona, but it is recommended to set the application code at the start of your application. It will track which application uploaded the statistics, and statistics will be visible on the [Developer Tools](https://test.amongstats.net/developer/applications/).

UserClient methods (each returns a promise):
```javascript
// Returns basic information on the Discord user like username, avatar code and when the AmongStats account was created
user.getInfo()

// Adds statistics to the users account. stats has to be an array of 18 integers
user.addStats(stats)

// Returns the most recent statistics of the user
user.getStats()

// Returns all of the users uploaded statistics
user.getStatsHistory()
```

GuildClient methods (each returns a promise):
```javascript
// Returns basic information on the Discord guild like id, name, icon code, command_prefix, owner, joined_on, screenshot_channel
let info = await guild.getInfo()

// Returns a list of all the users in the guild with an account, along with their hidden status
let users = await guild.getUsers()

// Returns basic information on a single user
let user = await guild.getUser(userId)

// Returns the most recently uploaded statistics from the given user
let userStats = await guild.getUserStats(userId)

// Returns all uploaded statistics from the given user
let userStatsHistory = await guild.getUserStatsHistory(userId)

// Returns the most recently uploaded statistics from all users in the guild with an account
let stats = await guild.getStats()
```
