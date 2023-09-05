const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//inicijalizacija servera preko socket.io apia, expressa i nodea 

const rooms = {};

// Postavljamo putanju za statičke resurse (HTML, CSS, JavaScript) koji se nalaze u direktorijumu 'client'.
app.use(express.static(path.join(__dirname, 'client')));



// Prikazuje početnu HTML stranicu kada korisnik pristupi osnovnom URL-u.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

// Ovo je osnovni deo servera koji obrađuje WebSocket komunikaciju.
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // Ovo je događaj koji se okida kada igrač kreira novu igru.
    socket.on('createGame', () => {
        const roomUniqueId = makeid(6);
        rooms[roomUniqueId] = {};
        socket.join(roomUniqueId);
        socket.emit("newGame", {roomUniqueId: roomUniqueId})
    });

    // Ovo je događaj koji se okida kada igrač želi da se pridruži postojećoj igri.
    socket.on('joinGame', (data) => {
        if(rooms[data.roomUniqueId] != null) {
            socket.join(data.roomUniqueId);
            socket.to(data.roomUniqueId).emit("playersConnected", {});
            socket.emit("playersConnected");
        }
    });

    // Ovo je događaj koji se okida kada igrač 1 izabere svoj potez.
    socket.on("p1Choice",(data)=>{
        let rpsValue = data.rpsValue;//rps value znaci koja je vrednost papir, kamen ili makaze
        rooms[data.roomUniqueId].p1Choice = rpsValue;
        socket.to(data.roomUniqueId).emit("p1Choice",{rpsValue : data.rpsValue});
        if(rooms[data.roomUniqueId].p2Choice != null) {
            declareWinner(data.roomUniqueId);
        }
    });

    // Ovo je događaj koji se okida kada igrač 2 izabere svoj potez.
    socket.on("p2Choice",(data)=>{
        let rpsValue = data.rpsValue;
        rooms[data.roomUniqueId].p2Choice = rpsValue;
        socket.to(data.roomUniqueId).emit("p2Choice",{rpsValue : data.rpsValue});
        if(rooms[data.roomUniqueId].p1Choice != null) {
            declareWinner(data.roomUniqueId);
        }
    });
});

// Funkcija za određivanje pobednika igre.
function declareWinner(roomUniqueId) {
    let p1Choice = rooms[roomUniqueId].p1Choice;
    let p2Choice = rooms[roomUniqueId].p2Choice;
    let winner = null;
    if (p1Choice === p2Choice) {
        winner = "d";
    } else if (p1Choice == "Paper") {
        if (p2Choice == "Scissor") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Rock") {
        if (p2Choice == "Paper") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Scissor") {
        if (p2Choice == "Rock") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    }
    io.sockets.to(roomUniqueId).emit("result", {
        winner: winner
    });
    rooms[roomUniqueId].p1Choice = null;
    rooms[roomUniqueId].p2Choice = null;
}

// Pokreće HTTP server na portu 3000.
server.listen(3000, () => {
    console.log('listening on *:3000');
});

// Funkcija za generisanje slučajnog jedinstvenog koda sobe.
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
