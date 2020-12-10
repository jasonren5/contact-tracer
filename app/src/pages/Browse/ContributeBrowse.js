import React from 'react';
import ContributeList from '../../components/Browse/ContributeList'

import { Typography, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive';

const useStyles = makeStyles(() => ({
    title: {
        marginTop: 30,
        marginBottom: 20,
    },
    body: {
        marginTop: '1%',
    },
}));

export default function ContributeBrowse() {
    const classes = useStyles();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <Container
            className={classes.body}
            maxWidth={isTabletOrMobile ? 'xs' : "lg"}
        >
            <Typography variant="h3" component="h1" className={classes.title}>
                Contribute to Articles
                </Typography>
            <ContributeList
                mediaQuery={isTabletOrMobile}
                maxWidth={isTabletOrMobile ? 'xs' : "lg"}
            />
        </Container>
    );

}