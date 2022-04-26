const fs = require("fs");
const httpServer = require("https").createServer({
    key: fs.readFileSync('./keys/privkey.pem'),
    cert: fs.readFileSync('./keys/fullchain.pem')
});
const options = {
    cors: {
        origin: "*",
        methods: ["*"]
    }
}
const io = require("socket.io")(httpServer, options);

const { createGame } = require('./util/words');

const homepageUrl = 'https://codenames.bogdanmihalcea.ro'

var usersByRoom = {};

function assignPlayerToRoom(uuid, playerName) {
    // if uuid does not exist, create new array and push playerName
     if (!(uuid in usersByRoom)){
        usersByRoom[uuid] = [];
        usersByRoom[uuid].push(playerName);
        //console.log(usersByRoom);
    }
    // if uuid does exist, skip creating array and push playerName
    else {
        usersByRoom[uuid].push(playerName);
        //console.log(usersByRoom);
    }
}

function removePlayerFromRoom(uuid, playerName) 
{
    // iterating usersByRoom
    for (const room in usersByRoom){
        // if (usersByRoom[uuid].length > 0){
            if (room == uuid){
                for (var i = 0; i < usersByRoom[uuid].length; i++){
                    if (playerName == usersByRoom[uuid][i]) {
                        console.log(usersByRoom[uuid][i] + " disconnected from room: " + uuid)
                        // remove the player from the saved room
                        usersByRoom[uuid].splice(i, 1);

                        // delete room if it is empty
                        if (usersByRoom[uuid].length == 0) {
                            delete usersByRoom[uuid];
                            break;
                        }
                    }
                }
            }
        // }
    }
}


io.on("connection", socket => {

    // timer
    socket.on('sendTimerUpdate', (timerData) => {
        //console.log(timerData.timeLeft)
        io.in(timerData.gameData.uuid).emit('receiveTimerUpdate', timerData.timeLeft);
    });

    // createGame event
    socket.on('createGame', (gameData) => {

        // store user data
        socket.playerName = gameData.playerName;
        socket.uuid = gameData.uuid;

        // join socket uuid and assign player to room
        socket.join(gameData.uuid);
        assignPlayerToRoom(gameData.uuid, gameData.playerName)

        // send updated players list to client
        io.in(gameData.uuid).emit("updateJoinedPlayersList", usersByRoom[gameData.uuid]);

        // logs
        console.log(gameData.playerName + ' created and joined the room: ' + gameData.uuid);
    })

    // startGame event
    socket.on('startGame', (gameData) => {
        createGame().then(words => {
            io.to(gameData.uuid).emit('startGame', words);

            // send updated players list to client
            io.in(gameData.uuid).emit("updateJoinedPlayersList", usersByRoom[gameData.uuid]);

            // send the name of the player who started the game
            socket.to(gameData.uuid).emit("startGameSnackbar",gameData.playerName);

            // logs
            console.log(gameData.playerName + ' started a game in room: ' + gameData.uuid);
        })
    })

    // sending the complete updated list of the words to everyone in the room
    socket.on('gameUpdate', ({gameData, words}) => {
        io.to(gameData.uuid).emit(gameData, words);
        
        // send updated players list to client
        io.in(gameData.uuid).emit("updateJoinedPlayersList", usersByRoom[gameData.uuid]);
    })

    // joinGame event
    socket.on('joinGame', (gameData) => {
        // store user data
        socket.playerName = gameData.playerName;
        socket.uuid = gameData.uuid;

        if (io.sockets.adapter.rooms.has(gameData.uuid)){
            socket.join(gameData.uuid);
            socket.to(gameData.uuid).emit('joinGame', gameData.playerName);

            assignPlayerToRoom(gameData.uuid, gameData.playerName)

            console.log(gameData.playerName + ' joined the room: ' + gameData.uuid);
            
        } else {
            console.log(gameData.playerName + ' tried to join an empty room: ' + gameData.uuid);
            // send user to homepage
            socket.emit('redirectHome', homepageUrl);
        }

        // send updated players list to client
        io.in(gameData.uuid).emit("updateJoinedPlayersList", usersByRoom[gameData.uuid]);
    })

    socket.on('disconnect', () => {
        removePlayerFromRoom(socket.uuid, socket.playerName);

        // send updated players list to client
        io.in(socket.uuid).emit("updateJoinedPlayersList", usersByRoom[socket.uuid]);
        socket.to(socket.uuid).emit('playerDisconnect', socket.playerName);
     });

});

httpServer.listen(3000);