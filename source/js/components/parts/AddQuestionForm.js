var React = require('react');

var AddQuestionForm = React.createClass({
    render: function() {
        return (
            <form ref="questionForm" className="questionForm" action="javascript:void(0)" onSubmit={this.questionAdded}>
                <label className="block">Skriv fråga (obligatoriskt)</label>
                <input className="block" type="text" placeholder="Skriv din fråga här" ref="questionInput" required />
                <label className="block">Svarsalternativ a (obligatoriskt)</label>
                <input className="block" type="text" placeholder="Skriv svarsalternativ a här" ref="answerAInput" required />
                <label className="block">Svarsalternativ b (obligatoriskt)</label>
                <input className="block" type="text" placeholder="Skriv svarsalternativ b här" ref="answerBInput" required />
                <label className="block">Svarsalternativ c</label>
                <input className="block" type="text" placeholder="Skriv svarsalternativ c här" ref="answerCInput" />
                <label className="block">Svarsalternativ d</label>
                <input className="block" type="text" placeholder="Skriv svarsalternativ d här" ref="answerDInput" />
                <button className="addQuestionBtn">Lägg till fråga</button>
            </form>
        )
    }
    ,questionAdded: function() {
        var question = this.refs.questionInput.value;
        var answerA = this.refs.answerAInput.value;
        var answerB = this.refs.answerBInput.value;
        var answerC = this.refs.answerCInput.value;
        var answerD = this.refs.answerDInput.value;

        var newQuestion = {
            q: question,
            a: answerA,
            b: answerB,
            c: answerC,
            d: answerD
        };

        this.props.emit('addQuestion', newQuestion);
        this.refs.questionForm.reset();
    }
})
module.exports = AddQuestionForm;