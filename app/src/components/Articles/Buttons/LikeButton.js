import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { toggleLikeByArticleID } from '../../../utils/functions/articles';
import { withFirebase } from '../../../utils/firebase';
import { withAuthorization, userLoggedInCondition } from '../../../utils/session';

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            numLikes: this.props.liked_users.length
        }
        this.toggleLike = this.toggleLike.bind(this);
    }

    componentDidMount() {
        const user = this.props.firebase.doGetCurrentUser();
        const user_id = (user ? user.uid : null);
        if (this.props.liked_users.includes(user_id)) {
            this.setState({
                liked: true
            })
        }
    }

    toggleLike() {
        this.setState({
            liked: !this.state.liked,
            numLikes: (this.state.liked ? this.state.numLikes - 1 : this.state.numLikes + 1)
        });

        toggleLikeByArticleID(this.props.firebase, this.props.article_id).then((res) => {
            if (res.error) {
                console.log("Error toggling like!");
                this.setState({
                    liked: !this.state.liked,
                    numLikes: (this.state.liked ? this.state.numLikes - 1 : this.state.numLikes + 1)
                });
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    render() {
        return (
            <IconButton aria-label="Like" onClick={this.toggleLike}>
                {this.state.liked ? (
                    <FavoriteIcon></FavoriteIcon>
                ) : (
                        <FavoriteBorderIcon></FavoriteBorderIcon>
                    )}
                {this.state.numLikes}
            </IconButton>
        )
    }

}

export default withAuthorization(userLoggedInCondition)(LikeButton);