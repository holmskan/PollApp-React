var React = require('react'); 

var JoinSpeakerForm = React.createClass({

    render: function() {

        return (
            <form action="javascript:void(0)" onSubmit={this.nameEntered}>
                <label>Ditt namn</label>
                <input type="text" placeholder="Ange ditt namn här" ref="nameInput" required  />
                <label>Presentation</label>
                <input type="text" placeholder="Ange namn på presentationen här" ref="titleInput" required />
                <button className="btn btn-primary">Anslut</button>  
            </form>
        )
    }
    ,nameEntered:function(){
        var name = this.refs.nameInput.value;
        var title = this.refs.titleInput.value;
        
        sessionStorage.title = title;

        this.props.emit('start', {
            speaker: {
                name: name
            }
            , title:title
        });
    }
})
module.exports = JoinSpeakerForm;