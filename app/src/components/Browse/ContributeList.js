import React from 'react';
import PageLoading from '../Loading/PageLoading'
import ContributeThumbnail from '../Browse/ContributeThumbnail'
import {withFirebase} from '../../utils/firebase'
import {getAllUnpublishedArticles} from '../../utils/functions/articles'
import { Grid } from "@material-ui/core";

class ContributeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: null
        }
    }

    componentDidMount() {
        getAllUnpublishedArticles(this.props.firebase).then((articles) => {
            const filteredArticles = articles.article_list.filter(article => !article.published)
            this.setState({
                articles: filteredArticles
            })
        })
    }

    render() {
        if(!this.state.articles) {
            return (
                <PageLoading />
            )
        }
        if(this.state.articles.length <= 0) {
            return(
                <p>No new articles to edit, check back in a few hours.</p>
            )
        }
        return(
            <Grid container item xs={6} spacing={3} direction="column">
                {this.state.articles.map((article, index) =>
                    <ContributeThumbnail key={article.id + index} article={article}/>
                )}
            </Grid>
        )
    }
}

export default withFirebase(ContributeList);