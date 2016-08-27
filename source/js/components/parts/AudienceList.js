var React = require('react'); 

var AudienceList = React.createClass({
    

    render:function() {

        var tableRows = this.props.audience.map((member, i) => {
        return (
            <tr key={i}>
                <td>{member.name}</td>
                <td>{member.id}</td>
            </tr>
        )
    })
        return (
            <section>
                <h2>Anslutna åhörare ({this.props.audience.length})</h2>
                <table className="table table-stripped">
                    <thead>
                        <tr>
                            <th>Namn</th>
                            <th>Socket ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </section>
        )   
    }
})
module.exports = AudienceList;