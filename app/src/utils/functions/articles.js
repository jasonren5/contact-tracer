import Article from '../../classes/Article'
import ArticleSection from '../../classes/ArticleSection'

const firebase = require("firebase");
require("firebase/functions");

var functions = firebase.functions();

async function getFullArticle(article_id) {
    
    var getFullArticleByID = functions.httpsCallable("getFullArticleByID");

    var articlePromise = getFullArticleByID({article_id: article_id}).then((response) => {
        let data = response.data;
        var sections = [];
        data.section_data.forEach((section) => {
            var s = new ArticleSection(data.article_data.article_id,section.section_id,section.type,section.body,[])
            sections.push(s)
        })

        var article = new Article(data.article_data.article_id, data.article_data.title, data.article_data.image_url, "Hello, World!", sections);
        return article;
    })

    return articlePromise;
}

export {getFullArticle};