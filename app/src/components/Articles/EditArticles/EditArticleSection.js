import React from 'react';
import EditArticleImage from "../../Sections/EditSectionImage";
import EditSectionText from "../../Sections/EditSectionText";

class EditArticleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCorrectSection() {
        switch (this.props.section.type) {
            case "text":
                return (<EditSectionText article_id={this.props.article_id} section={this.props.section} refreshArticle={this.props.refreshArticle} />);
            case "image":
                return (<EditArticleImage article_id={this.props.article_id} section={this.props.section} refreshArticle={this.props.refreshArticle} />)
            default:
                console.log("error loading section");
                return (<div></div>)
        }
    }

    render() {
        return (
            <div style={sectionStyle}>
                {this.props.section.body && this.renderCorrectSection()}
            </div>
        )

    }
}

export default EditArticleSection;

const sectionStyle = {
    // marginTop: 10,
    // marginBottom: 10
}