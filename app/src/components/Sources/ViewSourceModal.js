import React, { useEffect, useState, useContext } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Typography
} from '@material-ui/core';

import { getPublicProfileData } from '../../utils/functions/users';
import { getSectionByID } from '../../utils/functions/articles';
import { FirebaseContext } from '../../utils/firebase';
import NameTag from '../Profiles/NameTag';

export default function ViewSourceModal(props) {
    const [user, setUser] = useState();
    const [date, setDate] = useState();
    const [sectionBody, setSectionBody] = useState();
    const firebase = useContext(FirebaseContext);


    useEffect(() => {
        if (props.source) {
            if (props.source.user === "generated") {
                const autoGenUser = {
                    displayName: "Auto Generated",
                }
                setUser(autoGenUser);
                setSectionBody("Title and Headline");
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
        }
    }, [props.source]);

    useEffect(() => {
        if (props.source) {
            getSectionByID(firebase, props.article_id, props.source.section).then((sectionVersions) => {
                const latestVersion = sectionVersions.slice(-1).pop();
                if (latestVersion) {
                    setSectionBody(latestVersion.body);
                }
            });
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
                                Date Created: <Typography variant="span" color="primary">{date}</Typography>
                            </DialogContentText>
                        }
                        {sectionBody &&
                            <DialogContentText id="alert-dialog-description">
                                Section: <Typography variant="span" color="primary">{sectionBody}</Typography>
                            </DialogContentText>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={props.closeModal}
                            color="secondary"
                            variant="contained"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    );
}