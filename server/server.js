var express = require('express');
var path = require('path');
var app = express();
var questions = require('./questions');

app.use(express.static('./build'));
app.use('*', function(req,res){
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html')); //__dirname global variabel i node.js 
})

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var connections = []; //array för att hålla antalet anslutningar
var audienceArr = []; //array för att hålla alla användare
//var questionsArr = [];
var title = 'Untitled presentation';
var speaker = {}; //här läggs talaren till.
var currentQuestion = null; 
var results = {
    a: 0
    ,b: 0
    ,c: 0
    ,d:0
};

/* håller koll på antalet anslutningar till sidan */
io.sockets.on('connection', function (socket) { //'connection' & 'disconnect' är automatiska event som triggas av socket.io när någon ansluter/eller tar bort anslutningen

    socket.on('disconnect', () => { //anropas när någon disconnectar
        connections.splice(connections.indexOf(socket), 1) //kollar vart i arrayen indexet ligger och plockar bort det. 1 --> betyder att det är ett element i arrayen som ska tas bort
        socket.disconnect(); //forcerar en disconnect (även om den har rapporterat att den har disconnectat, för att verkligen se till att den är disconnectad)
        console.log('WS connections: %s', connections.length);

        for(var i = 0; i<audienceArr.length;i++) {
            if(audienceArr[i].id === socket.id) {
                audienceArr.splice(i, 1);
                break;
            }
        }
        io.sockets.emit('audience', audienceArr);

    })
    .on('join', (payload) => { //payload är objektet som innehåller member
        var member = { 
            id:socket.id //finns per automatik på alla web socket anslutningar
            ,type: 'audience'
            ,name:payload.member.name
        };
        audienceArr.push(member);
        socket.emit('joined', member); //skickar bara till den som har skickat join-meddelandet
       
        io.sockets.emit('audience', audienceArr); //skickar iväg till alla som är anslutna. 1:a parametern är det vi lyssnar på.
        console.log(payload.member.name);
    })
    .on('start', (payload) => {
        speaker = payload.speaker;
        speaker.id = socket.id;
        speaker.type = 'speaker'; //vilken typ av medlemsobjekt detta är.

        title = payload.title; //Här sätts titeln på presentationen

        socket.emit('joined', speaker); //berättar för speaker att den har anslutit sig till servern
       
        io.sockets.emit('started', {
            title:title
            , speaker:speaker.name
            , audience: audienceArr
            , questions: questions}); //när folk ansluter berättar vi vad talaren heter och vad namnet på presentationen är.
    })
    .on('ask', (question) => {
        currentQuestion = question;
        
        results = {
            a: 0
            ,b: 0
            ,c: 0
            ,d:0
        };

        console.log(question.q);
        io.sockets.emit('ask', question);
    })
    .on('answer', (optionName) => {
        results[optionName]++;
        io.sockets.emit('results', results); //skickar iväg resultaten
        console.log('Resultat: %j', results); //%j formateras som Json
    })
    .on('addQuestion', (newQuestion) => {
        questions.push(newQuestion);

        io.sockets.emit('addQuestion', questions);
        console.log(newQuestion);
    })
//    ta emot frågan från addquestion, skicka den liknande som i started, io-sockets.emit 

    /* När någon ansluter pushas anslutningen in i connections-arrayen */
    connections.push(socket); 

    /**
     * Emit: funktion för att skicka data till webbläsaren. Pushar data i anslutningen.
     */
    socket.emit('welcome', {
        title:  title
        ,speaker: speaker.name
        ,questions: questions
        ,currentQuestion: currentQuestion
    });  

    console.log('WS connections: %s', connections.length);
})


console.log('server is running on http://localhost:3000'); 