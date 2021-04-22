import React from 'react';
import { Container } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PageLoading from '../../components/Loading/PageLoading';
import { getPublishedArticleByID } from '../../utils/functions/articles';
import ArticleHeader from "../../components/Articles/ArticleHeader";
import { withFirebase } from '../../utils/firebase';
import firebase from 'firebase'
import {Step} from 'prosemirror-transform'
import {schema} from 'prosemirror-schema-basic'
import createEditor from './utils/createEditor'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class BreakingArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: null,
            updated: null,
            article: null
        }
    }

    componentDidMount() {
        let article_id = this.props.match.params.articleId
        this.props.firebase.db.collection("breaking_articles").doc(article_id).get().then(doc => {
            this.setState({article: doc.data()})
        }).catch((err) => {
            console.log(err);
            window.location.href = ('/article-not-found');
        })
        this.props.firebase.db.collection("breaking_articles").doc(article_id).collection("steps").orderBy('createdAt', 'asc').get().then((res) => {
            const steps = res.docs.map((doc) => {
                const stepRaw =  doc.data().step
                const step = Step.fromJSON(schema, JSON.parse(stepRaw))
                return step
            })
            const view = createEditor("breakingArticle", steps)
            this.setState({view: view})
        }).catch((err) => {
            console.log(err);
            window.location.href = ('/article-not-found');
        })
    }

    render() {
        // Render the article
        return (
            <Container
                component="main"
                maxWidth="md"
                spacing={2}
            >
                <Alert severity="warning" style={alertStyles}>This article is in-progress. Some of the information contained in it may be incomplete or incorrect.</Alert>
                {this.state.article && 
                    <ArticleHeader article={this.state.article}/>
                }
                <div id='breakingArticle'></div>
                
            </Container>
        )
    }
}

export default withFirebase(BreakingArticlePage);

const alertStyles = {
    marginTop: 20,
    marginBottom: 20
}