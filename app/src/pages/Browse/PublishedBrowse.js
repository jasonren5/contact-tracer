import React, { useState } from 'react';
import BrowseHeader from '../../components/Browse/BrowseHeader'
import PublishedList from '../../components/Browse/PublishedList'

import { Grid, Typography, Container } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive';

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: 30,
        marginBottom: 20,
    },
    body: {
        marginTop: '1%',
    },
    searchBar: {
        margin: '0 auto',
        marginBottom: '1rem',
        // maxWidth: 800
    },
}));

export default function PublishedBrowse() {
    const [typeFilter, setTypeFilter] = useState("all");
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    // TODO: Move search bar - have it actually query the database? (probally not because speed)
    return (
        <Container
            className={classes.body}
            maxWidth={isTabletOrMobile ? 'xs' : "lg"}
        >
            <Typography variant="h3" component="h1" className={classes.title}>
                Browse Articles
            </Typography>

            <BrowseHeader updateParent={setTypeFilter} />
            <SearchBar
                value={searchTerm}
                onChange={(newValue) => setSearchTerm(newValue)}
                onCancelSearch={() => setSearchTerm("")}
                className={classes.searchBar}
                placeholder={"Search for Article"}
                cancelOnEscape
            />
            <PublishedList typeFilter={typeFilter} />
        </Container>

    );
}
