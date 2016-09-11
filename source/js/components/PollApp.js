var React = require("react");
var io = require('socket.io-client');
var Header = require('./parts/Header');
var Link = require('react-router').Link;

var PollApp = React.createClass({

    getInitialState: function() {
        return {
            status:'disconnected'
            ,title: ''
            ,member: {}
            ,audience: []
            ,speaker: ''
            ,questions: []
            ,currentQuestion: null 
            ,currentAnswer: null
            ,results: {
                a:0
                ,b:0
                ,c:0
                ,d:0
            }
        }
    }

    ,componentWillMount: function () {
        this.socket = io("http://localhost:3000"); //vill man ansluta till annan server skriver man in denna inom parentes
        this.socket.on('connect', () => { //eventet på klientsidan heter connect när man ansluter till servern
            this.setState({status:'connected'}); 
            console.log('Ansluten till websocket');
        })
        .on('disconnect', () => { //kallas för att man kedjar på. kan göras pga inget semikolon och börjar med punkt.
            this.setState({status:'disconnected'}); //eftersom vi använder => kan vi använda this annars skulle denna syfta på socket men nu syftar den på React-objektet
            console.log('Inte ansluten till websocket');
        })

        /**
         * Datan i 'welcome' skickas med i info-variabeln. Här lyssnar vi på welcome som vi har satt i server.js
         * welcome körs så snart vi anslutit till servern 
         */
        .on('welcome', (info) => { 
            if(sessionStorage.member) {
                var member = JSON.parse(sessionStorage.member); 
               
                if(member.type === 'audience') { 
                    this.socket.emit('join', {
                        member: member
                    });
                } else if(member.type === 'speaker') {
                    this.socket.emit('start', {
                        speaker: member
                        ,title: sessionStorage.title
                    });
                }
            }
            this.setState(info); // {title: info.title} kan skicka in bara info, alltså this.setState(info); eftersom info-objektet har en egenskap som heter title. pga man skickar objekt? 
        })
        .on('audience', (audienceArr) => {
            this.setState({audience: audienceArr});
        })
        .on('joined', (member) => { //member som har joinat lagras i session 
            this.setState({member:member});
            sessionStorage.member = JSON.stringify(member); //sessionState ligger inbyggt i JS
        })
        .on('started', (info) => {
            this.setState(info); //speaker-egenskapen och titel-egenskapen kommer att uppdateras per auto eftersom vi satt det i vårt state
        })
        .on('ask', (question) => {
            this.setState({
                currentQuestion:question
                ,currentAnswer: null
                ,results: {
                    a:0, b:0 ,c:0 ,d:0}
            });
        })
        .on('results', (results) => {
            this.setState({
                results: results
            })
        })
        .on('addQuestion', (questions) => {
            this.setState({
                questions: questions
            })
        })
    }
    ,onEmit: function(msg, payload) { //egen emit funktion
        //this.setState(payload);
        this.socket.emit(msg, payload); //emit-funktionaliteten som finns inbyggd i socket
    }
    ,answer: function(optionName) {
        this.setState({
            currentAnswer: optionName
        })
        this.socket.emit('answer', optionName);
    }
    ,render: function () {
        /**
         * React.cloneElement() funktion som klonar elementet, första parametern vad vi vill klona, andra parametern state-objektet -- state-objektet pushas ner i vår undersida/underkomponent
         */
        var propObj = jQuery.extend({
            emit:this.onEmit
            ,answer:this.answer
        }, this.state);
        return (
            <div className="wrapper">
                <Header title={this.state.title}
                status={this.state.status} 
                speaker={this.state.speaker} />
                {React.cloneElement(this.props.children, propObj)}

                <footer>
                    <ul>
                        <li><Link to="/">Audience</Link></li>
                        <li><Link to="/speaker">Speaker</Link></li>
                        <li><Link to="/board">Board</Link></li>
                    </ul>
                </footer>
            </div>
        )
    }

});
module.exports = PollApp;