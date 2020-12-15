import React, { useEffect, useState, useContext } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link
} from '@material-ui/core';

import { getPublicProfileData } from '../../utils/functions/users';
import { FirebaseContext } from '../../utils/firebase';
import NameTag from '../Profiles/NameTag';

export default function ViewSourceModal(props) {
    const [user, setUser] = useState();
    const [date, setDate] = useState();
    const firebase = useContext(FirebaseContext);


    useEffect(() => {
        if (props.source) {
            if (props.source.user === "generated") {
                const autoGenUser = {
                    displayName: "Auto Generated",
                }
                setUser(autoGenUser);
            }
            else {
                getPublicProfileData(firebase, props.source.user).then((user) => {
                    var newUser = user;
                    newUser["user_id"] = props.source.user;
                    setUser(user);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }, [props.source]);

    useEffect(() => {
        if (props.source) {
            const date = new Date(props.source.created._seconds * 1000).toLocaleString();
            setDate(date);
            console.log(date);
        }
    }, [props.source]);


    return (
        <div className="Source Dialog">
            {props.source &&
                <Dialog
                    open={props.open}
                    onClose={props.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">Source {props.source.order}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            URL: <Link href={props.source.url}>{props.source.url}</Link>
                        </DialogContentText>
                        {user &&
                            <DialogContentText id="alert-dialog-description">
                                Contributor: <NameTag variant="span" user={user} />
                            </DialogContentText>
                        }
                        {date &&
                            <DialogContentText id="alert-dialog-description">
                                Date Created: {date}
                            </DialogContentText>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={props.closeModal}
                            color="primary"
                        >
                            Close
                    </Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    );
}