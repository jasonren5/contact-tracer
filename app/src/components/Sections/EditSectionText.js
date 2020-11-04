import React from 'react';
import {TextField, IconButton} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { publishContribution, addSection } from "../../utils/functions/articles"
import { Button } from '@material-ui/core';
import ArticleSection from '../../classes/ArticleSection';

class EditSectionText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            merging: false,
            section: props.section,
            mergeSection: null,
            editValue: props.section.body,
            mergeValue: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.publishChanges = this.publishChanges.bind(this);
        this.addSectionBelow = this.addSectionBelow.bind(this);
    }

    handleChange(event) {
        if(this.state.merging) {
            this.setState({
                mergeValue: event.target.value
            })
        } else {
            this.setState({
                editValue: event.target.value
            })
        }
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
            merging: false,
            editValue: this.state.section.body,
            mergeValue: ""
        });
    }

    publishChanges(){
        const newBody = (this.state.merging ? this.state.mergeValue : this.state.editValue);
        const newSection = (this.state.merging ? this.state.mergeSection : this.state.section);
        publishContribution(this.state.section, this.state.editValue).then((response)=>{
            // handle merge conflict
            if (response.conflict) {
                this.setState({
                    mergeSection: response.section,
                    mergeValue: response.section.body,
                    merging: true,
                })
                return;
            }
            this.setState({
                editing: false,
                section: response.section,
                mergeSection: null,
                editValue: response.section.body
            })
        })
    }

    addSectionBelow() {
        let section = new ArticleSection(this.state.section.article_id,null,null,"text","This is a new section, edit it to add content.",(this.state.section.order+1),[]);
        addSection(section).then((section) => {
            console.log(section);
            this.props.addSectionToArticle(section);
        })
    }

    renderEditing() {
        const isDisabled = (this.state.merging ? "disabled" : "");
        return (
            <Card>
                <CardContent>
                    <TextField
                        id="open_editor"
                        label="Edit Section"
                        multiline
                        disabled={this.state.merging}
                        rowsMax={10}
                        value={this.state.editValue}
                        onChange={(event) => this.handleChange(event)}
                        style={textInputStyle}
                    />
                    {this.state.merging && (
                        <TextField
                            id="open_editor"
                            label="Merge Changes"
                            multiline
                            rowsMax={10}
                            value={this.state.mergeValue}
                            onChange={(event) => this.handleChange(event)}
                            style={textInputStyle}
                        />
                    )}
                </CardContent>
                <CardActions>
                    <Button color="primary" aria-label="upload picture" component="span" onClick={this.toggleEditing}>
                        Cancel
                    </Button>
                    <Button color="primary" aria-label="upload picture" component="span" onClick={this.publishChanges}>
                        Publish
                    </Button>
                </CardActions>
            </Card>
        )
    }

    renderNotEditing() {
        return (
            <Card>
                <CardContent>
                    <p style={textStyle}>{this.state.section.body}</p>
                </CardContent>
                <CardActions>
                    <Button color="primary" aria-label="edit" component="span" onClick={this.toggleEditing}>
                        Edit
                    </Button>
                    <Button color="primary" aria-label="edit" component="span" onClick={this.addSectionBelow}>
                        Add Section
                    </Button>
                </CardActions>
            </Card>
        )
    }

    render() {
        return (
            <div>
                {this.state.editing
                    ? this.renderEditing()
                    : this.renderNotEditing()
                }
            </div>
        )
    }
}

export default EditSectionText;

const textStyle = {
    textAlign: "left"
}

const textInputStyle = {
    width: "100%"
}