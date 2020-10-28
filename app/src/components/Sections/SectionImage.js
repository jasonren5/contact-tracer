import React from 'react'

class SectionImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src={this.props.section.body}/>
            </div>
        )
    }
}

export default SectionImage;