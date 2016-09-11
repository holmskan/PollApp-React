var React = require('react'); 

var Ask = React.createClass({
    
    answer:function(optionName) {
        this.props.answer(optionName); 
    }
    ,render: function () {
        var options = Object.keys(this.props.question); 
        options.shift();

        var optionsList = options.map((optionName, i) => {
            return (
                <li className='answerBtn' key={i}>
                    <a href='#' onClick={this.answer.bind(this, optionName)}> {optionName}: {this.props.question[optionName]}</a>
                </li>
            )
        })
        console.log(options.join('\n'));

        return (
            <section>
                <h3>{this.props.question.q}</h3>
                <ul className='answerList'>
                    {optionsList}
                </ul>
            </section>
        )
        
    }
});

module.exports = Ask;