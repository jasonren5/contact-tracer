import React from 'react'

class SectionText extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>{this.props.section.body}</p>
            </div>
        )
    }
}

export default SectionText;