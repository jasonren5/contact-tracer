import React from 'react';
import EditArticleImage from "./EditArticleImage";
import EditSectionText from "../../Sections/EditSectionText";

class EditArticleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCorrectSection() {
        switch (this.props.section.type) {
            case "text":
                return (<EditSectionText section={this.props.section} addSectionToArticle={this.props.addSectionToArticle} />);
            case "image":
                return (<EditArticleImage image_url={this.props.section.body} alt_text={this.props.section.alt_text} />)
            default:
                console.log("error loading section");
                return (<div></div>)
        }
    }

    render() {
        return (
            <div style={sectionStyle}>
                {this.renderCorrectSection()}
            </div>
        )

    }
}

export default EditArticleSection;

const sectionStyle = {
    marginTop: 20,
    marginBottom: 20
}