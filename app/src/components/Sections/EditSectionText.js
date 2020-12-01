import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { publishContribution, addSection } from "../../utils/functions/articles"
import { withFirebase } from '../../utils/firebase';
import { Button } from '@material-ui/core';
import ArticleSection from '../../classes/ArticleSection';
import { CircularProgress } from '@material-ui/core';

class EditSectionText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            merging: false,
            section: props.section,
            mergeSection: null,
            editValue: props.section.body,
            mergeValue: "",
            publishingNewSection: false,
            publishingChanges: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.publishChanges = this.publishChanges.bind(this);
        this.addSectionBelow = this.addSectionBelow.bind(this);
    }

    handleChange(event) {
        if (this.state.merging) {
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

    publishChanges() {
        this.setState({publishingChanges: true});
        const newBody = (this.state.merging ? this.state.mergeValue : this.state.editValue);
        const newSection = (this.state.merging ? this.state.mergeSection : this.state.section);
        publishContribution(this.props.firebase, this.state.section, this.state.editValue).then((response) => {
            // handle merge conflict
            if (response.conflict) {
                var localSection = this.state.section;
                localSection.version_id = response.section.version_id;
                this.setState({
                    mergeSection: response.section,
                    mergeValue: response.section.body,
                    merging: true,
                    section: localSection,
                    publishingChanges: false
                })
                return;
            }
            this.setState({
                editing: false,
                section: response.section,
                mergeSection: null,
                editValue: response.section.body,
                publishingChanges: false
            })
        })
    }

    addSectionBelow() {
        this.setState({publishingNewSection: true});
        let section = new ArticleSection(this.state.section.article_id, null, null, "text", "This is a new section, edit it to add content.", (this.state.section.order + 1), []);
        addSection(this.props.firebase, section).then((section) => {
            this.setState({publishingNewSection: false});
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
                        {this.state.publishingChanges
                            ? <CircularProgress size={20} color="primary" />
                            : 'Publish Changes'
                        }
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
                        {this.state.publishingNewSection
                            ? <CircularProgress size={20} color="primary" />
                            : 'Add Section'
                        }
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

export default withFirebase(EditSectionText);

const textStyle = {
    textAlign: "left"
}

const textInputStyle = {
    width: "100%"
}