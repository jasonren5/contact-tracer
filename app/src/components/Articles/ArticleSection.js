import React from 'react';
import SectionImage from "../Sections/SectionImage";
import SectionText from "../Sections/SectionText";

class ArticleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCorrectSection() {
        switch (this.props.section.type) {
            case "text":
                return (<SectionText section={this.props.section}></SectionText>);
            case "image":
                return (<SectionImage section={this.props.section}></SectionImage>);
            default:
                console.log("error loading section");
                return (<div></div>)
        }

    }

    render() {
        return (
            <div className="article section container">
                {this.props.section.body && this.renderCorrectSection()}
            </div>
        );
    }
}

export default ArticleSection;