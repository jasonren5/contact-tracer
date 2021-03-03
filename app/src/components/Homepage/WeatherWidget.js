import React, { useEffect, useContext } from 'react';
import { usePosition } from 'use-position';

import { FirebaseContext } from '../../utils/firebase';
import { getWeather } from '../../utils/functions/widgets';


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
            getWeather(firebase, latitude, longitude).then((response) => {
                console.log(response);
            });
        }
    }, [latitude]);

    useEffect(() => {
        if (error) {
            console.log(error);
            getWeather(firebase, null, null).then((response) => {
                console.log(response);
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