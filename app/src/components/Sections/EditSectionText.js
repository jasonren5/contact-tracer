import React from 'react';
import {TextField, IconButton} from 'material-ui';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Edit from '@material-ui/icons/Edit';
import Publish from '@material-ui/icons/Publish';
import Undo from '@material-ui/icons/Undo';
import { publishContribution } from "../../utils/functions/articles"
import { Button } from '@material-ui/core';

class EditSectionText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            section: props.section,
            mergeSection: null
        };
        this.editValue = props.section.body;
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.publishChanges = this.publishChanges.bind(this);
    }

    handleChange(event) {
        this.editValue = event.target.value
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing
        });
    }

    publishChanges(){
        publishContribution(this.state.section, this.editValue).then((response)=>{
            if (response.conflict) {
                this.setState({
                    mergeSection: response.section
                })
            }
            this.setState({
                editing: false,
                section: response.section,
                mergeSection: null
            })
        })
    }

    renderEditing() {
        return (
            <Card>
                <CardContent>
                    <TextField
                        id="open_editor"
                        label="Edit Section"
                        multiline
                        rowsMax={4}
                        value={this.editValue}
                        onChange={(event) => this.handleChange(event)}
                    />
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

    renderNotEditing(){
        return (
            <Card>
                <CardContent>
                    <p>{this.state.section.body}</p>
                </CardContent>
                <CardActions>
                    <Button color="primary" aria-label="edit" component="span" onClick={this.toggleEditing}>
                        Edit
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