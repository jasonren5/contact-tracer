import React, { useState, useContext, useEffect } from 'react';

import { Paper, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../utils/firebase';
import { getStocks } from '../../utils/functions/widgets';

import Ticker from 'react-ticker';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        margin: "1.5em",
        width: "20em",
    },
    stockTicker: {
        display: "inline",
        marginRight: ".5em",
    },
    stockTickerHolder: {
        width: "35em",
    },
}));


export default function StocksWidget() {
    const [stockData, setStockData] = useState([]);
    const [date, setDate] = useState();
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        getStocks(firebase).then((res) => {
            setStockData(res.stock_info);
            const date = res.date_scraped.substring(0, 10).replace(/-/g, "/")
            const year = date.substring(0, 4);
            setDate(date.substring(5) + "/" + year);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        <div className="userCountContainer">
            {(stockData.length > 0 && date) &&
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Closing Prices: <i>{date}</i>
                    </Typography>
                    <Ticker speed={3} mode={'smooth'}>
                        {() => (
                            <div className={classes.stockTickerHolder}>
                                {stockData.map((stock) =>
                                    <Typography className={classes.stockTicker} variant="h6">
                                        <b>{stock.name}:</b> ${stock.closing_price}
                                    </Typography>
                                )}
                            </div >
                        )}
                    </Ticker>
                </Paper>
            }
        </div >
    );
}

