import React, { useEffect, useContext } from 'react';
import { usePosition } from 'use-position';

import { FirebaseContext } from '../../utils/firebase';
// import { getWeather } from '../../utils/functions/widgets';
import axios from 'axios';


import { Button } from '@material-ui/core';

export default function WeatherWidget() {
    const firebase = useContext(FirebaseContext);
    const {
        latitude,
        longitude,
        error,
    } = usePosition();

    useEffect(() => {
        if (latitude && longitude && !error) {
            console.log(latitude, longitude);
            axios.get('https://us-central1-cse437project.cloudfunctions.net/getWeatherRequest', {
                params: {
                    "retrieved": true,
                    "latitude": latitude,
                    "longitude": longitude
                }
            })
                .then(res => {
                    console.log(res.data);
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
                    console.log(res.data);
                });
        }
    }, [error]);

    return (
        <code>
            latitude: {latitude}<br />
            longitude: {longitude}<br />
            error: {error}
        </code>
    );
}