var React = require("react");
var ReactDOM = require("react-dom");
var PollApp = require("./components/PollApp");

var Audience = require("./components/Audience");
var Speaker = require("./components/Speaker");
var Board = require("./components/Board");

var { Router, Route, browserHistory, IndexRoute } = require('react-router'); //skapar 4 variabler och hämtar deras egenskaper som finns i react-router istället för var Router = require('react-router').Router och så vidare. Kan göra detta tack vara ES6. Måste heta samma sak som i react-router-filen.

/* Skapa en router-konfiguration - vad som ska visas beroende på vilken webbadress */ 

/**
 * alla routes ligger i huvudrouten pga vill hämta dessa i pollapp för att få med sig dess header footer med sig
 */
var routerConfig = (
    <Router history={browserHistory}>
        <Route path="/" component={PollApp}>
            <Route path="/speaker" component={Speaker} />
            <Route path="/board" component={Board} />
            <IndexRoute component={Audience} />
        </Route>
    </Router>
)

ReactDOM.render(routerConfig,document.getElementById("reactContainer"));

