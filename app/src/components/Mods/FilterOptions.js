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
import { addBannedWord } from '../../utils/functions/filter';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: "2rem",
        marginBottom: "2rem",
        margin: "20rem"
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
}));

export default function FilterOptions() {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const filter = useContext(FilterContext);
    const [filterWords, setFilterWords] = useState("");
    const [viewBanned, setViewBanned] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [addTerm, setAddTerm] = useState("test");
    const [publishingChanges, setPublishingChanges] = useState(false);

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

    const handleSubmitAdd = () => {
        setPublishingChanges(true);
        addBannedWord(firebase, filter, addTerm).then((list) => {
            setPublishingChanges(false);
            setFilterWords(list.join(', '));
            setAddTerm("");
        })
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
                        onClick={handleSubmitAdd}
                    >
                        {publishingChanges
                            ? <CircularProgress size={20} color="primary" />
                            : 'Submit'
                        }
                    </Button>
                </Paper>
            }
        </div >
    );
}