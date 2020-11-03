import React from 'react';
import SectionImage from "../Sections/SectionImage";
import EditSectionText from "../Sections/EditSectionText";

class EditArticleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        switch (this.props.section.type) {
            case "text":
                return (<EditSectionText section={this.props.section}></EditSectionText>);
            case "image":
                return (<SectionImage section={this.props.section}></SectionImage>);
            default:
                console.log("error loading section");
                return (<div></div>)
        }

    }
}

export default EditArticleSection;