import React from 'react'

class SectionText extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p style={textStyle}>{this.props.section.body}</p>
            </div>
        )
    }
}

export default SectionText;

const textStyle = {
    textAlign: "left"
}
