import React, { useEffect, useState } from 'react';
import { usePosition } from 'use-position';

import axios from 'axios';

import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        margin: "1.5em",
        width: "15rem",
    },
    image: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
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
                        <Grid item xs={3}>
                            <img
                                className={classes.image}
                                src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                                alt="Weather Icon">
                            </img>
                        </Grid>
                        <Grid item xs={9}>
                            <p>city: {weather.city}</p>
                            <p>icon: {weather.icon}</p>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </div >
    );
}