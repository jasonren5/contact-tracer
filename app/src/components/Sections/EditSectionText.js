import React from 'react';
import { publishContribution, addSection } from "../../utils/functions/articles"
import { withFirebase } from '../../utils/firebase';

import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { CSSTransition } from 'react-transition-group';
import ConfirmModal from '../Modals/ConfirmModal';

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
        marginTop: ".75rem",
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
        right: 40,
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
            sectionHover: false,
            publishingDelete: false,
            removeModal: false,
            source: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.publishChanges = this.publishChanges.bind(this);
        this.addSectionBelow = this.addSectionBelow.bind(this);
        this.handleRemoveSection = this.handleRemoveSection.bind(this);
        this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this);
        this.handleOpenRemoveModal = this.handleOpenRemoveModal.bind(this);

        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
    }

    handleChange(event) {
        const { id, value } = event.target;

        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
            merging: false,
            editValue: this.state.section.body,
            mergeValue: "",
            sectionHover: false,
            source: "",
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
        this.setState({
            publishingDelete: true,
            editValue: "",

        }, function () {
            this.publishChanges();
        });
    }

    handleCloseRemoveModal() {
        this.setState({
            removeModal: false,
        });
    }

    handleOpenRemoveModal() {
        this.setState({
            removeModal: true,
        });
    }

    publishChanges() {
        this.setState({ publishingChanges: true });
        const newBody = (this.state.merging ? this.state.mergeValue : this.state.editValue);
        const newSection = (this.state.merging ? this.state.mergeSection : this.state.section);
        const finalSource = this.state.source === "" ? null : this.state.source;
        publishContribution(this.props.firebase, newSection, newBody, this.state.merging, finalSource).then((response) => {
            // handle merge conflict
            if (response.conflict) {
                var localSection = this.state.section;
                localSection.version_id = response.section.version_id;
                this.setState({
                    mergeSection: response.section,
                    mergeValue: response.section.body,
                    merging: true,
                    section: localSection,
                    publishingChanges: false,
                    editing: true,
                    publishingDelete: false,
                    removeModal: false,
                });
                return;
            }
            else {
                this.props.refreshArticle();
                this.setState({
                    editing: false,
                    section: response.section,
                    mergeSection: null,
                    editValue: response.section.body,
                    publishingChanges: false,
                    publishingDelete: false,
                    removeModal: false,
                });
            }
        })
    }

    addSectionBelow() {
        this.setState({ publishingNewSection: true });
        let section = new ArticleSection(this.state.section.article_id, null, null, "text", "This is a new section, edit it to add content.", (this.state.section.order + 1), []);
        addSection(this.props.firebase, section).then((section) => {
            this.setState({ publishingNewSection: false });
            this.props.refreshArticle();
        })
    }

    renderEditing() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <Card>
                    <CardContent>
                        <TextField
                            id="editValue"
                            label="Edit Section"
                            type="text"
                            multiline
                            disabled={this.state.merging}
                            rowsMax={10}
                            value={this.state.editValue}
                            onChange={(event) => this.handleChange(event)}
                            className={classes.editField}
                        />
                        <TextField
                            id="source"
                            label="Edit Source"
                            type="url"
                            disabled={this.state.merging}
                            rowsMax={10}
                            value={this.state.source}
                            onChange={(event) => this.handleChange(event)}
                            className={classes.editField}
                        />
                        {this.state.merging && (
                            <TextField
                                id="mergeValue"
                                label="Merge Changes"
                                type="text"
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
                onMouseOver={this.hoverOn}
                onMouseOut={this.hoverOff}
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
                            onClick={this.handleOpenRemoveModal}
                            aria-label="remove-section"
                            color="secondary"
                            disabled={this.state.publishingDelete || this.state.publishingChanges}
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
                            disabled={this.state.publishingDelete || this.state.publishingChanges}
                        >
                            <EditIcon />
                        </IconButton>
                    </div>
                </CSSTransition>
                <ConfirmModal
                    open={this.state.removeModal}
                    closeModal={this.handleCloseRemoveModal}
                    handleConfirm={this.handleRemoveSection}
                    confirmAction={"Remove Text Section"}
                    publishingConfirm={this.state.publishingDelete}
                />
            </div>
        )
    }
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
                            refreshArticle={this.props.refreshArticle}
                            order={this.state.section.order}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default compose(withFirebase, withStyles(styles, { withTheme: true }))(EditSectionText);