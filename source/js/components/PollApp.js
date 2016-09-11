var React = require("react");
var io = require('socket.io-client');
var Header = require('./parts/Header');
var Link = require('react-router').Link;

var PollApp = React.createClass({

    getInitialState: function () {
        return {
            status: 'disconnected'
            , title: ''
            , member: {}
            , audience: []
            , speaker: ''
            , questions: []
            , currentQuestion: null
            , currentAnswer: null
            , results: {
                a: 0
                , b: 0
                , c: 0
                , d: 0
            }
        }
    }

    , componentWillMount: function () {
        this.socket = io("http://localhost:3000"); 
        this.socket.on('connect', () => { 
            this.setState({ status: 'connected' });
            console.log('Ansluten till websocket');
        })
            .on('disconnect', () => { 
                this.setState({ status: 'disconnected' }); 
                console.log('Inte ansluten till websocket');
            })

            /**
             * Data in 'welcome' is sent w info object. Listening to 'welcome', set in server.js. 
             * 'welcome' will run when connecting to servern 
             */
            .on('welcome', (info) => {
                if (sessionStorage.member) {
                    var member = JSON.parse(sessionStorage.member);

                    if (member.type === 'audience') {
                        this.socket.emit('join', {
                            member: member
                        });
                    } else if (member.type === 'speaker') {
                        this.socket.emit('start', {
                            speaker: member
                            , title: sessionStorage.title
                        });
                    }
                }
                this.setState(info);  
            })
            .on('audience', (audienceArr) => {
                this.setState({ audience: audienceArr });
            })
            .on('joined', (member) => { //member who joined added to session  
                this.setState({ member: member });
                sessionStorage.member = JSON.stringify(member); 
            })
            .on('started', (info) => {
                this.setState(info); //speaker and title properties will be updated automatically -- since in the state. 
            })
            .on('ask', (question) => {
                this.setState({
                    currentQuestion: question
                    , currentAnswer: null
                    , results: {
                        a: 0, b: 0, c: 0, d: 0
                    }
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
    , onEmit: function (msg, payload) { //own emit functionality
        this.socket.emit(msg, payload); //built in emit functionality in socket
    }
    , answer: function (optionName) {
        this.setState({
            currentAnswer: optionName
        })
        this.socket.emit('answer', optionName);
    }
    , render: function () {
        var propObj = jQuery.extend({
            emit: this.onEmit
            , answer: this.answer
        }, this.state);
        return (
            <div className="wrapper">
                <Header title={this.state.title}
                    status={this.state.status}
                    speaker={this.state.speaker} />
                {React.cloneElement(this.props.children, propObj) }

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