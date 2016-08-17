// irc and game connections
var irc    = require('irc'),
printf     = require('printf'),
keyHandler = require('./keyHandler.js'),
config     = require('./config.js');

// socket webchat
var app    = require('express')();
var http   = require('http').Server(app);
var io     = require('socket.io')(http);


var client = new irc.Client(config.server, config.nick, {
    channels: [config.channel],
    port: config.port || 6667,
    sasl: false,
    nick: config.nick,
    userName: config.nick,
    password: config.password,
    //This has to be false, since SSL in NOT supported by twitch IRC (anymore?)
    // see: http://help.twitch.tv/customer/portal/articles/1302780-twitch-irc
    secure: false,
    floodProtection: config.floodProtection || false,
    floodProtectionDelay: config.floodProtectionDelay || 100,
    autoConnect: false,
    autoRejoin: true
});

var commandRegex = config.regexCommands ||
new RegExp('^(' + config.commands.join('|') + ')$', 'i');

client.addListener('message' + config.channel, function(from, message) {
    if (message.match(commandRegex)) {
        if (config.printToConsole) {
            //format console output if needed
            var maxName = config.maxCharName,
            maxCommand = config.maxCharCommand,
            logFrom = from.substring(0, maxName),
            logMessage = message.substring(0, 6).toLowerCase();
            //format log
            console.log(printf('%-' + maxName + 's % ' + maxCommand + 's',
                logFrom, logMessage));

        }

        // Should the message be sent the program?
        if (config.sendKey) {
            keyHandler.sendKey(message.toLowerCase());
        }
    }
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
var i = 0;
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
  });
});

// socket.io chat message display (to page)
io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
  console.log(' listening on *:3000');
});

// connection log
console.log('Connecting to IRC...');
console.log('connected to irc.freenote.net');
console.log('Emulator: ZSNES');
