import React, { useContext, useState } from 'react';

import {
    Typography,
    Paper,
    Button,
    IconButton,
    Grid,
    TextField,
    CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HighlightOff } from '@material-ui/icons';
import SearchBar from "material-ui-search-bar";
var Highlight = require('react-highlighter');

import { FirebaseContext } from '../../utils/firebase';
import { FilterContext } from '../../utils/filter';
import { addBannedWord, addWhitelistWord } from '../../utils/functions/filter';

import ConfirmModal from '../Modals/ConfirmModal';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    bodyText: {
        paddingBottom: "2rem",
        textAlign: "left",
        paddingTop: ".5em",
        paddingLeft: "5em",
        paddingRight: "5em",
    },
    closeIcon: {
        marginRight: ".5em",
        marginBottom: "0",
        paddingBottom: "0",
        paddingTop: ".5em"
    },
    title: {
        fontWeight: "bold"
    },
    searchBar: {
        margin: '0 auto',
        maxWidth: 800
    },
    addButton: {
        marginBottom: "2em",
    }
}));

export default function FilterOptions() {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const filter = useContext(FilterContext);
    const [filterWords, setFilterWords] = useState("");
    const [viewBanned, setViewBanned] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [addTerm, setAddTerm] = useState("");
    const [addPublishingChanges, setAddPublishingChanges] = useState(false);
    const [removeTerm, setRemoveTerm] = useState("");
    const [removePublishingChanges, setRemovePublishingChanges] = useState(false);
    const [confirmBan, setConfirmBan] = useState(false);


    const handleToggleView = () => {
        if (!viewBanned) {
            filter.updateWords();
        }
        const filterList = filter.filter.list();
        setFilterWords(filterList.join(', '));
        setViewBanned(!viewBanned);
        setSearchTerm("");
        setAddTerm("");
    }

    const handleAddChange = (event) => {
        setAddTerm(event.target.value);
    };

    const handleRemoveChange = (event) => {
        setRemoveTerm(event.target.value);
    };

    const handleSubmitAdd = () => {
        setAddPublishingChanges(true);
        addBannedWord(firebase, filter, addTerm).then((list) => {
            setAddPublishingChanges(false);
            setFilterWords(list.join(', '));
            setAddTerm("");
            closeConfirmModal();
        })
    }

    const handleSubmitRemove = () => {
        setRemovePublishingChanges(true);
        addWhitelistWord(firebase, filter, removeTerm).then((list) => {
            setRemovePublishingChanges(false);
            setFilterWords(list.join(', '));
            setRemoveTerm("");
        })
    }

    const openConfirmModal = () => {
        setConfirmBan(true);
    }

    const closeConfirmModal = () => {
        setConfirmBan(false);
    }

    return (
        <div className="banned-words-view">
            {!viewBanned ?
                <Button variant="contained" color="secondary" onClick={handleToggleView}>
                    Trigger Warning: View Filtered Words
            </Button>
                :
                <Paper className={classes.body}>
                    <Grid container justify="flex-end">
                        <IconButton className={classes.closeIcon} color="secondary" onClick={handleToggleView}>
                            <HighlightOff fontSize="large" />
                        </IconButton>
                    </Grid>
                    <Typography variant="h4" className={classes.title}>Banned Words:</Typography>
                    <SearchBar
                        value={searchTerm}
                        onChange={(newValue) => setSearchTerm(newValue)}
                        onCancelSearch={() => setSearchTerm("")}
                        className={classes.searchBar}
                        placeholder={"Search for Term"}
                        cancelOnEscape
                    />
                    <Typography className={classes.bodyText}>
                        <Highlight search={searchTerm}>
                            {filterWords}
                        </Highlight>
                    </Typography>
                    <Grid
                        container
                        direction="row" justify="space-evenly"
                        alignItems="center"
                    >
                        <Grid item className="AddTermButton">
                            <TextField
                                required
                                label="Add Banned Term"
                                id="add-banned-term"
                                value={addTerm}
                                onChange={handleAddChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.addButton}
                                onClick={openConfirmModal}
                            >
                                {addPublishingChanges
                                    ? <CircularProgress size={20} color="secondary" />
                                    : 'Submit'
                                }
                            </Button>
                        </Grid>
                        <Grid item className="RemoveTermButton">
                            <TextField
                                required
                                label="Remove Banned Term"
                                id="remove-banned-term"
                                value={removeTerm}
                                onChange={handleRemoveChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.addButton}
                                onClick={handleSubmitRemove}
                            >
                                {removePublishingChanges
                                    ? <CircularProgress size={20} color="secondary" />
                                    : 'Submit'
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            }
            <ConfirmModal
                open={confirmBan}
                closeModal={closeConfirmModal}
                handleConfirm={handleSubmitAdd}
                confirmAction={"Add Banned Word"}
                secondaryText={"This will affect any previously published article as well!"}
                publishingConfirm={addPublishingChanges}
            />
        </div >
    );
}