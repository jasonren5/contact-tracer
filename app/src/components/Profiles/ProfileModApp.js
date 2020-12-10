import React, { } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withFirebase } from '../../utils/firebase';

import { submitApplication } from '../../utils/functions/applications';

class ProfileModApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "general",
            body: "",
            allFieldsFull: false,
            loading: false,
            characterMessage: "",
        }

        this.typeSelectChange = this.typeSelectChange.bind(this);
        this.bodyTextChange = this.bodyTextChange.bind(this);
        this.submitApplication = this.submitApplication.bind(this);
    }

    componentDidMount() {
        this.checkAllFieldsFull();
    }

    typeSelectChange(event) {
        this.setState({
            type: event.target.value
        }, () => this.checkAllFieldsFull());
    }

    bodyTextChange(event) {
        this.setState({
            body: event.target.value
        }, () => this.checkAllFieldsFull());
    }

    checkAllFieldsFull() {
        const bodyFilled = this.state.body.length > 10;
        const bodyWithinLimit = this.state.body.length < 500

        var characterMessage = (bodyFilled ? "" : "Your response is " + (10 - this.state.body.length) + " characters below the minimum length.")
        characterMessage = (bodyWithinLimit ? characterMessage : "Your response is " + (this.state.body.length - 500) + " characters above the maximum length.")

        if (bodyFilled && bodyWithinLimit) {
            this.setState({
                allFieldsFull: true,
                characterMessage: characterMessage
            });
        } else {
            this.setState({
                allFieldsFull: false,
                characterMessage: characterMessage
            });
        }
    }

    submitApplication() {
        console.log("awaiting implementation, printing state instead");
        console.log(this.state);
        this.setState({
            loading: true
        })
        submitApplication(this.props.firebase, this.state.type, this.state.body).then((res) => {
            if(res.error) {
                // TODO display error message, if we want
                this.setState({
                    loading: false
                })
            } else {
                this.setState({
                    loading: false,
                    type: 'general',
                    body: ""
                })
            }
            
        })
    }

    render() {
        return (
            <Grid container direction="column">
                <h3>Apply to be an Expert</h3>
                <FormControl variant="outlined">
                    <InputLabel id="mod-app-label">Field of Expertise</InputLabel>
                    <Select
                        labelId="mod-app-label"
                        id="mod-app-select"
                        value={this.state.type}
                        onChange={(event) => this.typeSelectChange(event)}
                        label="Field of Expertise"
                        style={spacing}
                    >
                        <MenuItem value={"general"}>General</MenuItem>
                        <MenuItem value={"science"}>Science</MenuItem>
                        <MenuItem value={"politics"}>Politics</MenuItem>
                        <MenuItem value={"world"}>World</MenuItem>
                        <MenuItem value={"technology"}>Technology</MenuItem>
                        <MenuItem value={"business"}>Business</MenuItem>
                        <MenuItem value={"health"}>Health</MenuItem>
                        <MenuItem value={"sports"}>Sports</MenuItem>
                        <MenuItem value={"arts"}>Arts and Entertainment</MenuItem>
                    </Select>
                    <TextField
                        id="mod-app-text"
                        label="Explain your Expertise"
                        type="text"
                        variant="outlined"
                        multiline
                        value={this.state.body}
                        onChange={(event) => this.bodyTextChange(event)}
                        style={spacing}
                    />
                    <Typography 
                        variant="body2" 
                        color={(this.state.characterMessage ? "error" : "textSecondary" )} 
                        component="p"
                        style={alignRight}
                    >
                        {this.state.characterMessage
                            ? (
                                this.state.characterMessage
                            )
                            : (
                                this.state.body.length + " characters"
                            )
                        }
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!this.state.allFieldsFull}
                        onClick={this.submitApplication}
                        style={spacing}
                    >
                        {(this.state.loading ? <CircularProgress /> : "Submit Application")}
                    </Button>
                </FormControl>
            </Grid>
        )
    }
}

const spacing = {
    marginTop: 5,
    marginBottom: 5
}

const alignRight = {
    flex: 1,
    flexGrow: 1,
    align: "right",
}

export default withFirebase(ProfileModApp);