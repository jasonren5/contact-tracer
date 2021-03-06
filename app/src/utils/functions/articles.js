import Article from '../../classes/Article';
import ArticleSection from '../../classes/ArticleSection';
import PublishedArticle from '../../classes/PublishedArticle';
import Source from '../../classes/Source';
import SectionVersion from '../../classes/SectionVersion';

async function getFullArticle(firebase, article_id) {

    var getFullArticleByID = firebase.functions.httpsCallable("getFullArticleByID");

    var articlePromise = getFullArticleByID({ article_id: article_id }).then((response) => {
        let data = response.data;
        var sections = [];
        var sources = [];

        data.sources_data.map(source => {
            if (!source.deleted) {
                var s = new Source(data.article_data.article_id, source.source_id, source.url, source.deleted, source.user, source.section, source.created, source.order);
                sources.push(s);
            }
        });
        data.section_data.forEach((section, index) => {
            var s = new ArticleSection(data.article_data.article_id, section.section_id, section.current_version, section.type, section.body, index, [], section.sources);
            sections.push(s)
        });

        var article = new Article(data.article_data.article_id, data.article_data.title, data.article_data.image_url, "Hello, World!", sections, sources);
        return article;
    });

    return articlePromise;
}

async function getAllUnpublishedArticles(firebase) {
    var getAllArticles = firebase.functions.httpsCallable("getAllArticlesWithSummaries");

    var response = await getAllArticles();
    return response.data;
}

async function getAllArticles(firebase) {
    var getAllArticles = firebase.functions.httpsCallable("getAllPublishedArticlesWithSummaries");

    var response = await getAllArticles();
    return response.data;
}

async function publishContribution(firebase, section, newBody, merging, source) {
    var addVersionToSection = firebase.functions.httpsCallable("addVersionToSection");

    let requestData = {
        article_id: section.article_id,
        section_id: section.id,
        previous_version_id: section.version_id,
        body: newBody,
        merging: merging
    };

    var response = await addVersionToSection(requestData);

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    var data = response.data.current_version;
    const conflict = response.data.conflict;

    var newSection = section;

    if (conflict) {
        newSection.body = data.body;
    } else {
        newSection.body = data.body;
        newSection.version_id = data.version_id;

        if (newSection.body === "" || newSection.type === "image") {
            newSection.sources.forEach(async (source) => {
                var deleteSource = await removeSource(firebase, newSection.article_id, source.source_id);
                console.log(deleteSource);
            });
        }

        if (source) {
            var sourceObject = await addSourceToArticle(firebase, newSection, source);
            return {
                section: newSection,
                conflict: conflict,
                sourceObject
            };
        }
    }

    return {
        conflict: conflict,
        section: newSection
    };
}

async function addSection(firebase, section, source) {
    var addSectionAtIndex = firebase.functions.httpsCallable("addSectionAtIndex");

    let requestData = {
        section: section
    }

    var response = await addSectionAtIndex(requestData);

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    var newSection = section;
    newSection.id = response.data.section_id;
    newSection.version_id = response.data.version_id;
    if (source) {
        var sourceObject = await addSourceToArticle(firebase, newSection, source);
        return { newSection, sourceObject };
    }

    return { newSection };
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

    const response = await toggleLikeByArticleID({ article_id: article_id });

    return response.data;
}

async function getPublishedArticleByID(firebase, article_id) {
    let getPublishedArticleByID = firebase.functions.httpsCallable("getPublishedArticleByID");

    const response = await getPublishedArticleByID({ article_id: article_id });

    var article = new PublishedArticle(response.data)

    return article;
}

async function editArticleTitle(firebase, article_id, title) {
    let editArticleTitle = firebase.functions.httpsCallable("editArticleTitle");

    const response = await editArticleTitle({
        article_id: article_id,
        title: title
    });

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    return response;
}

async function editArticleImage(firebase, article_id, image_url) {
    let editArticleImage = firebase.functions.httpsCallable("editArticleHeaderImage");

    const response = await editArticleImage({
        article_id: article_id,
        image_url: image_url
    });

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    return response;
}

async function addSourceToArticle(firebase, section, source) {
    var addSourceToArticle = firebase.functions.httpsCallable("addSourceToArticle");

    const requestData = {
        article_id: section.article_id,
        section_id: section.id,
        source_url: source,
    };

    var response = await addSourceToArticle(requestData);

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    var newSource = response.data;

    return newSource;
}

async function getAllSources(firebase, article_id) {
    let getAllSourcesByID = firebase.functions.httpsCallable("getAllSources");
    var response = await getAllSourcesByID({ article_id: article_id });

    return response;
}

async function removeSource(firebase, article_id, source_id) {
    let deleteSource = firebase.functions.httpsCallable("deleteSource");

    const response = await deleteSource({
        article_id: article_id,
        source_id: source_id,
    });

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    return response;
}

async function editSource(firebase, article_id, source_id, new_url) {
    let deleteSource = firebase.functions.httpsCallable("editSource");

    const response = await deleteSource({
        article_id: article_id,
        source_id: source_id,
        new_url: new_url,
    });

    if (response.data === null) {
        throw "Error publishing contribution!";
    }

    return response;
}

async function getSectionByID(firebase, article_id, section_id) {
    let getSection = firebase.functions.httpsCallable("getSectionByID");

    const response = await getSection({
        article_id: article_id,
        section_id: section_id
    })

    var versions = [];

    response.data.forEach((versionData) => {
        versions.push(new SectionVersion(article_id, section_id, versionData))
    })

    return versions;
}

export {
    getFullArticle,
    getAllArticles,
    publishContribution,
    addSection,
    createBlankArticle,
    createArticleWithTitleAndImage,
    toggleLikeByArticleID,
    getPublishedArticleByID,
    getAllUnpublishedArticles,
    editArticleTitle,
    editArticleImage,
    addSourceToArticle,
    getAllSources,
    removeSource,
    editSource,
    getSectionByID,
};