import React from 'react'
import SectionImage from "./Sections/SectionImage"
import SectionText from "./Sections/SectionText"

class ArticleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        switch(this.props.section.type) {
            case "text":
                return(<SectionText section={this.props.section}></SectionText>);
            case "image":
                return(<SectionImage section={this.props.section}></SectionImage>);
            default:
                console.log("error loading section");
                return(<div></div>)
        }

    }
}

export default ArticleSection;