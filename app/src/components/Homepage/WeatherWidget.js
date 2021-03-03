import React, { useEffect } from 'react';
import { usePosition } from 'use-position';
import { Button } from '@material-ui/core';

export default function WeatherWidget() {

    const {
        latitude,
        longitude,
        error,
    } = usePosition();



    useEffect(() => {
        if (latitude && longitude && !error) {
            const requestURL = `api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        }
    }, [latitude]);

    useEffect(() => {
        if (error) {
            console.log(error);
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