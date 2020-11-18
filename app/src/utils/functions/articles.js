import Article from '../../classes/Article'
import ArticleSection from '../../classes/ArticleSection'


async function getFullArticle(firebase, article_id) {

    var getFullArticleByID = firebase.functions.httpsCallable("getFullArticleByID");

    var articlePromise = getFullArticleByID({ article_id: article_id }).then((response) => {
        let data = response.data;
        var sections = [];
        data.section_data.forEach((section, index) => {
            var s = new ArticleSection(data.article_data.article_id, section.section_id, section.current_version, section.type, section.body, index, [])
            sections.push(s)
        });

        var article = new Article(data.article_data.article_id, data.article_data.title, data.article_data.image_url, "Hello, World!", sections);
        return article;
    });

    return articlePromise;
};

async function getAllArticles(firebase) {
    var getAllArticles = firebase.functions.httpsCallable("getAllArticlesWithSummaries");

    var articlesPromise = getAllArticles().then((response) => {
        let data = response.data;
        return data;
    });

    return articlesPromise;
};

async function publishContribution(firebase, section, newBody) {
    var addVersionToSection = firebase.functions.httpsCallable("addVersionToSection");

    let requestData = {
        article_id: section.article_id,
        section_id: section.id,
        previous_version_id: section.version_id,
        body: newBody
    };

    var response = await addVersionToSection(requestData);
    var data = response.data.current_version;
    const conflict = response.data.conflict;

    var newSection = section;

    if (conflict) {
        newSection.body = data.body;
    } else {
        newSection.body = data.body;
        newSection.version_id = data.version_id;
    }

    return {
        conflict: conflict,
        section: newSection
    };
}

async function addSection(firebase, section) {
    var addSectionAtIndex = firebase.functions.httpsCallable("addSectionAtIndex");

    let requestData = {
        section: section
    }

    var response = await addSectionAtIndex(requestData);

    console.log(response);

    var newSection = section;
    newSection.id = response.data.section_id;
    newSection.version_id = response.data.version_id;

    return newSection
}

async function createBlankArticle(firebase) {
    let createBlankArticle = firebase.functions.httpsCallable("createBlankArticle");
    createBlankArticle().then(response => console.log(response));
}

/*
*   Creates an article with a title and an image url by targeting firebase function createArticleWithTitleAndImage
*       Params: data = JSON containing fields title and image_url
*       Returns: response from server
*/
async function createArticleWithTitleAndImage(firebase, data) {
    let createArticleWithTitleAndImage = firebase.functions.httpsCallable("createArticleWithTitleAndImage");

    let response = await createArticleWithTitleAndImage(data);

    return response.data;
}

async function toggleLikeByArticleID(firebase, article_id) {
    let toggleLikeByArticleID = firebase.functions.httpsCallable("toggleLikeByArticleID");

    const response = await toggleLikeByArticleID({article_id: article_id});

    return response.data;
}

export {
    getFullArticle,
    getAllArticles,
    publishContribution,
    addSection,
    createBlankArticle,
    createArticleWithTitleAndImage,
    toggleLikeByArticleID
};