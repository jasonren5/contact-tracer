import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { toggleLikeByArticleID } from '../../utils/functions/articles';
import { withFirebase } from '../../utils/firebase';

class LikeButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            liked: false
        }
        this.toggleLike = this.toggleLike.bind(this);
    }

    componentDidMount() {
        const user_id = this.props.firebase.doGetCurrentUser();
        if(this.props.liked_users.includes(user_id)){
            this.setState({
                liked: true
            })
        }
    }

    toggleLike() {
        toggleLikeByArticleID(this.props.firebase, this.props.article_id).then((res)=>{
            if(res.error) {
                console.log("Error toggling like!");
            } else {
                this.setState({
                    liked: !this.state.liked
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    render() {
        return (
            <IconButton aria-label="Like" onClick>
                {this.state.liked ?(
                    <FavoriteIcon></FavoriteIcon>
                ):(
                    <FavoriteBorderIcon></FavoriteBorderIcon>
                )}
            </IconButton>
        )
    }

}

export default withFirebase(LikeButton);