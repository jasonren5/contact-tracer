import React, { useEffect, useState } from 'react';
import { usePosition } from 'use-position';

import axios from 'axios';

import { Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        margin: "1.5em",
        width: "15rem",
        marginTop: ".25em",
        marginBottom: ".25em",
    },
    image: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
    },
    lowPadding: {
        paddingTop: ".2em!important",
        paddingBottom: ".2em!important",
    }
}));


export default function WeatherWidget() {
    const {
        latitude,
        longitude,
        error,
    } = usePosition();

    const [weather, setWeather] = useState();
    const classes = useStyles();

    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        if (latitude && longitude && !error) {
            axios.get('https://us-central1-cse437project.cloudfunctions.net/getWeatherRequest', {
                params: {
                    "retrieved": true,
                    "latitude": latitude,
                    "longitude": longitude
                }
            })
                .then(res => {
                    setWeather(res.data)
                });
        }
    }, [latitude]);

    useEffect(() => {
        if (error) {
            console.log(error);
            axios.get('https://us-central1-cse437project.cloudfunctions.net/getWeatherRequest', {
                params: {
                    "retrieved": false,
                }
            })
                .then(res => {
                    setWeather(res.data);
                });
        }
    }, [error]);

    return (
        <div className="weatherContainer">
            {weather &&
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={3} className={classes.lowPadding}>
                            <img
                                className={classes.image}
                                src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                                alt="Weather Icon">
                            </img>
                        </Grid>
                        <Grid item xs={9} className={classes.lowPadding}>
                            <Typography variant="h6">{weather.city}</Typography>
                            <Typography variant="h6">{weather.temperature}°</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </div >
    );
}