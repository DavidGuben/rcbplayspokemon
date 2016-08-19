// irc and game connections
var irc        = require('irc'),
printf         = require('printf'),
keyHandler     = require('./keyHandler.js'),
config         = require('./config.js');

// socket webchat
var app        = require('express')();
var http       = require('http').Server(app);
var io         = require('socket.io')(http);

// login and sequelize
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var sequelize  = require('sequelize');
var path       = require('path');

// database
var userlogininfos = require('./models')['userlogininfos'];

console.log(__dirname + '/public');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars',handlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname)));


// irc client connection
var client = new irc.Client(config.server, config.nick, {
    channels: [config.channel],
    port: config.port || 6667, // this is the port the irc connects to
    sasl: false,
    nick: config.nick,
    userName: config.nick,     // pulls username from irc client  (AndroIRC)
    password: config.password, // pulls passwordk from irc client (AndroIRC)
    // This has to be false, since SSL in NOT supported by twitch IRC
    // see: http://help.twitch.tv/customer/portal/articles/1302780-twitch-irc
    secure: false,
    floodProtection: config.floodProtection || false,
    floodProtectionDelay: config.floodProtectionDelay || 100,
    autoConnect: false,
    autoRejoin: true
});

// regexp pulls the commands from the keys
var commandRegex = config.regexCommands ||
new RegExp('^(' + config.commands.join('|') + ')$', 'i');

// listens to irc connection
client.addListener('message' + config.channel, function(from, message) {
    // display the mssage only if it matches an available command
    if (message.match(commandRegex)) {
        if (config.printToConsole) {
            // format console output if needed
            var maxName = config.maxCharName,
            maxCommand = config.maxCharCommand,
            logFrom = from.substring(0, maxName),
            logMessage = message.substring(0, 6).toLowerCase();
            // format log
            console.log(printf('%-' + maxName + 's % ' + maxCommand + 's',
                logFrom, logMessage));
                  io.emit('chat message', logFrom +' : '+ logMessage);
        }

        // Should the message be sent the program?
        if (config.sendKey) {
	    // sends message to keyhandler and from keyhandler to program
            keyHandler.sendKey(message.toLowerCase());
        }
    }
});
// error listener
client.addListener('error', function(message) {
    console.log('error: ', message);
});

// client connection
client.connect();

// express route for web chat
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// socket.io chat connection
io.on('connection', function(socket) {
  console.log('A user connected');
  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});

// socket.io chat message display (to console)
io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

process.setMaxListeners(16);

//login functionality



// server listener
http.listen(3000, function() {
  console.log(' listening on *:3000');
});

// connection log
console.log('Connecting to IRC...');
console.log('connected to irc.freenote.net');
console.log('Emulator: ZSNES');
