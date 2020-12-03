import React from 'react';
import { publishContribution, addSection } from "../../utils/functions/articles"
import { withFirebase } from '../../utils/firebase';

import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { CSSTransition } from 'react-transition-group';

import { compose } from 'recompose';

import ArticleSection from '../../classes/ArticleSection';
import AddSectionField from './AddSectionField';

import {
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    CircularProgress
} from '@material-ui/core';

const styles = theme => ({
    body: {
        textAlign: "left",
        padding: "1rem",
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
        paddingTop: "1.5rem",
        zIndex: "200",
        "&:hover": {
            background: "#8eacbb",
            // paddingTop: "1.5rem",
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
        right: 30,
    },
    removeButtonWrapper: {
        position: "absolute",
        top: 0,
        right: 0,
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
        this.handleRemoveSection = this.handleRemoveSection.bind(this);

        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
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

    hoverOn() {
        this.setState({
            sectionHover: true
        });
    }

    hoverOff() {
        this.setState({
            sectionHover: false
        });
    }

    handleRemoveSection() {
        // TODO:This should just send an update to publish changes where the changes are empty
        console.log("remove section");
    }

    publishChanges() {
        this.setState({ publishingChanges: true });
        // TODO: Jakob: Are these two lines below still used??
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
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
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
                            className={classes.editField}
                        />
                        {this.state.merging && (
                            <TextField
                                id="open_editor"
                                label="Merge Changes"
                                multiline
                                rowsMax={10}
                                value={this.state.mergeValue}
                                onChange={(event) => this.handleChange(event)}
                                className={classes.editField}
                            />
                        )}
                    </CardContent>
                    <CardActions>
                        <Button
                            className={classes.submitButton}
                            aria-label="submit edit"
                            component="span"
                            onClick={this.publishChanges}
                        >
                            {this.state.publishingChanges
                                ? <CircularProgress size={20} color="primary" />
                                : 'Submit Changes'
                            }
                        </Button>
                        <Button
                            className={classes.cancelButton}
                            aria-label="cancel edit"
                            component="span"
                            onClick={this.toggleEditing}
                            disabled={this.state.publishingChanges}
                        >
                            Cancel
                    </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }

    renderNotEditing() {
        const { classes } = this.props;
        return (
            <div
                className={classes.highlightWrapper}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
            >
                <Typography variant="body1" className={classes.body} >{this.state.section.body}</Typography>
                <CSSTransition
                    in={this.state.sectionHover}
                    classNames="alert"
                    timeout={200}
                    unmountOnExit
                >
                    <div className={classes.removeButtonWrapper}>
                        <IconButton
                            onClick={this.handleRemoveSection}
                            aria-label="remove-section"
                            color="secondary"
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={this.state.sectionHover}
                    classNames="alert"
                    timeout={200}
                    unmountOnExit
                >
                    <div className={classes.editButtonWrapper} >
                        <IconButton
                            onClick={this.toggleEditing}
                            aria-label="edit-section"
                            color="secondary"
                        >
                            <EditIcon />
                        </IconButton>
                    </div>
                </CSSTransition>
            </div>
        )
    }
    // TODO: Only render if it isn't empty/blank 
    render() {
        return (
            <div className="Edit Article Section">
                {this.state.section.body &&
                    <div className="Render if Not Empty">
                        {
                            this.state.editing
                                ? this.renderEditing()
                                : this.renderNotEditing()
                        }
                        < AddSectionField
                            article_id={this.state.section.article_id}
                            addSectionToArticle={this.props.addSectionToArticle}
                            order={this.state.section.order}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default compose(withFirebase, withStyles(styles, { withTheme: true }))(EditSectionText);