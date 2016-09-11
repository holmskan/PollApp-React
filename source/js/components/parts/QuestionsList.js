var React = require('react');

var QuestionsList = React.createClass({
    ask: function(question) {
        this.props.emit('ask', question);
        //console.log(question);
    }
    ,render: function() {
        var questions = this.props.questions.map((question, i) => {
            return (
                <li key={i}>
                    <a href='#' onClick={this.ask.bind(this, question)}> {question.q}</a>
                </li>
            )
        })
        return (
            <section className="questionList">
                <h2>Frågor: ({this.props.questions.length}) </h2>
                <ul>
                    {questions}
                </ul>
            </section>
        )
    }
    
})
module.exports = QuestionsList;