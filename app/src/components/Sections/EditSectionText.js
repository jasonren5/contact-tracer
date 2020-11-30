import React from 'react';
import { publishContribution, addSection } from "../../utils/functions/articles"
import { withFirebase } from '../../utils/firebase';

import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { compose } from 'recompose';

import ArticleSection from '../../classes/ArticleSection';
import AddSectionField from './AddSectionField';

import { TextField, Button, Card, CardContent, CardActions, CircularProgress } from '@material-ui/core';

const styles = theme => ({
    textStyle: {
        textAlign: "left",
    },
    textInputStyle: {
        width: "100%",
    },
    body: {
        textAlign: "left",
        // marginBottom: "1rem",
        padding: "1rem",
        paddingTop: "2rem",
    },
    root: {
        zIndex: "-1"
    },
    editField: {
        width: "100%",
        height: "200%",
    },
    highlightWrapper: {
        position: "relative",
        padding: ".25rem",
        borderRadius: "8px",
        transition: ".5s ease",
        zIndex: "200",
        "&:hover": {
            background: "#8eacbb",
        },
    },
    wrapper: {
        position: "relative",
        margin: "1rem",
        padding: ".5rem",
    },
    editButtonWrapper: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    editingButtonsWrapper: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    submitButton: {
        color: theme.palette.success.main
    },
    cancelButton: {
        color: theme.palette.error.main
    },
});

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
            publishingChanges: false,
            sectionHover: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.publishChanges = this.publishChanges.bind(this);
        this.addSectionBelow = this.addSectionBelow.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
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
            mergeValue: "",
            sectionHover: false,
        });
    }

    toggleHover() {
        this.setState({
            sectionHover: !this.state.sectionHover
        });
    }

    publishChanges() {
        this.setState({ publishingChanges: true });
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
        this.setState({ publishingNewSection: true });
        let section = new ArticleSection(this.state.section.article_id, null, null, "text", "This is a new section, edit it to add content.", (this.state.section.order + 1), []);
        addSection(this.props.firebase, section).then((section) => {
            this.setState({ publishingNewSection: false });
            this.props.addSectionToArticle(section);
        })
    }

    renderEditing() {
        const isDisabled = (this.state.merging ? "disabled" : "");
        const { classes } = this.props;
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
                        className={classes.textInputStyle}
                    />
                    {this.state.merging && (
                        <TextField
                            id="open_editor"
                            label="Merge Changes"
                            multiline
                            rowsMax={10}
                            value={this.state.mergeValue}
                            onChange={(event) => this.handleChange(event)}
                            className={classes.textInputStyle}
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
        const { classes } = this.props;
        return (
            <div
                className={classes.highlightWrapper}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
            >
                <Typography variant="body1" className={classes.body} >{this.state.section.body}</Typography>
                {this.state.sectionHover &&
                    <div className={classes.editButtonWrapper} >
                        <IconButton
                            onClick={this.toggleEditing}
                            aria-label="edit-section"
                            color="secondary"
                        >
                            <EditIcon />
                        </IconButton>
                    </div>
                }
            </div>
        )
    }

    render() {
        return (
            <div className="Edit Article Section">
                {this.state.editing
                    ? this.renderEditing()
                    : this.renderNotEditing()
                }
                <AddSectionField
                    article_id={this.state.section.article_id}
                    addSectionToArticle={this.props.addSectionToArticle}
                    order={this.state.section.order} />
            </div>
        )
    }
}

export default compose(withFirebase, withStyles(styles, { withTheme: true }))(EditSectionText);