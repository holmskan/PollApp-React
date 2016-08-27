var React = require('react');
var Display = require('./parts/Display');
var JoinSpeakerForm = require('./parts/JoinSpeakerForm');
var AudienceList = require('./parts/AudienceList');
var QuestionsList = require('./parts/QuestionsList');
var AddQuestionForm = require('./parts/AddQuestionForm');

var Speaker = React.createClass({

    render: function() {

        return (
            <div>
                <Display if={this.props.status === 'connected'}>
                    <Display if={this.props.member.type === 'speaker'}>
                    <QuestionsList 
                        questions={this.props.questions} 
                        emit={this.props.emit}
                    />
                    <AddQuestionForm emit={this.props.emit}/>
                    <AudienceList audience={this.props.audience} />
                    </Display>
                    <Display if={this.props.member.type !== 'speaker'}>
                        <JoinSpeakerForm emit={this.props.emit} />
                    </Display>
                </Display>
            </div>
        )
    }
})
module.exports = Speaker;