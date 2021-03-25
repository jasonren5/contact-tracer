import React from 'react';
import ScheduleIcon from '@material-ui/icons/Schedule';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class ArticleDate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            published: new Date(),
            updated: new Date(),
            dateText: "Just Now"
        }
    }

    componentDidMount() {
        const article = this.props.article
        const published = new Date(article.created._seconds * 1000)
        const updated = new Date(article.updated._seconds * 1000)
        const now = new Date()
        const minute = 60 * 1000
        const hour = minute * 60
        const day = hour * 24
        const week = day * 7
        const timeSincePublish = now - published

        var text = '';
        if (timeSincePublish < minute) {
            text = "just now"
        } else if(timeSincePublish < hour) {
            const mins = Math.floor(timeSincePublish/1000/60)
            text = mins + " mins ago"
        } else if(timeSincePublish < day) {
            const hrs = Math.floor(timeSincePublish/1000/60/60)
            text = hrs + " hours ago"
        } else if(timeSincePublish < week) {
            const days = Math.floor(timeSincePublish/1000/60/60/24)
            text = days + " days ago"
        } else {
            const weeks = Math.floor(timeSincePublish/1000/60/60/24/7)
            text = weeks + " weeks ago"
        }

        this.setState({
            published: published,
            updated: updated,
            dateText: text
        })
    }

    render() {
        return (
            <Tooltip title={ "Published "+this.state.dateText+". Not yet updated."} >
                <IconButton color="secondary">
                    <ScheduleIcon />
                    {this.state.dateText}
                </IconButton>
            </Tooltip>
        )
    }
}

export default ArticleDate;