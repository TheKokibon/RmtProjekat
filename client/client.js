
const socket = io();
let roomUniqueId = null;
let player1 = false;

//ovo je glavna funkcija koja se kreira kada igrac kreira novu pariju
function createGame() {
    player1 = true;
    socket.emit('createGame');
}

//ovo je glavna funkcija koja se poziva kada igrac zeli da se pridruzi postojecoj partiji
function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
    socket.emit('joinGame', {roomUniqueId: roomUniqueId});
}

//ovo je dogadjaj koji se okida kad se kreira nova igra na serveru
socket.on("newGame", (data) => {
    roomUniqueId = data.roomUniqueId; //postavljamo jedinstveni kod sobe koju smo dobili od servera
    document.getElementById('initial').style.display = 'none';//sakrivamo pocetni deo igre
    document.getElementById('gamePlay').style.display = 'block';//prikazujemo deo gde se igra odvija
    let copyButton = document.createElement('button');//kopiranje koda pomocu dugmeta
    copyButton.style.display = 'block';
    copyButton.classList.add('btn','btn-primary','py-2', 'my-2')
    copyButton.innerText = 'Copy Code';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(function() {
            console.log('Async: Uspešno kopiranje koda!');
        }, function(err) {
            console.error('Async: Kod se nije: ', err);
        });
    });
    //poruka sa kodom i dugmetom koje kopira taj isti kod, kako bi mogli da se prikljucimo sobi
    document.getElementById('waitingArea').innerHTML = `Čekamo protvnika, molimo podelite kod ${roomUniqueId} da se pridružite`;
    document.getElementById('waitingArea').appendChild(copyButton);
});

//dogadjaj koji se okida kad se oba igraca povezu na igru
socket.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';
})

//dogadjaj koji se desava kada igrac 1 donese neku odluku(kamen,papir,makaze)
socket.on("p1Choice",(data)=>{
    if(!player1) {
        createOpponentChoiceButton(data);
    }
});

//dogadjaj koji se desava kada igrac2 donese neku odluku(papir,kamen,makaze)
socket.on("p2Choice",(data)=>{
    if(player1) {
        createOpponentChoiceButton(data);
    }
});

//dogadjaj koji odredjuje ishod igre
socket.on("result",(data)=>{
    let winnerText = '';
    if(data.winner != 'd') {
        if(data.winner == 'p1' && player1) {
            winnerText = 'Pobeda!';
        } else if(data.winner == 'p1') {
            winnerText = 'Gubitak!';
        } else if(data.winner == 'p2' && !player1) {
            winnerText = 'Pobeda!';
        } else if(data.winner == 'p2') {
            winnerText = 'Gubitak!';
        }
    } else {
        winnerText = `Izjednačeno je!`;
    }
    document.getElementById('opponentState').style.display = 'none';
    document.getElementById('opponentButton').style.display = 'block';
    document.getElementById('winnerArea').innerHTML = winnerText;
});

//fja koja salje izbor igraca na server
function sendChoice(rpsValue) {
    const choiceEvent= player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent,{
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });
    //kreira se dugme sa izborom igraca i prikazuje
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.innerText = rpsValue;
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);
}

//fja koja kreira izbor protivnika odnosno dugme i prikazuje ga 
function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Protivnik je napravio odluku";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.classList.add(data.rpsValue.toString().toLowerCase());
    opponentButton.style.display = 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
}