import ArticleSection from './ArticleSection';
import Source from './Source';

/*
    Stores article information.
    id: UID tied to firebase document id to identify the article.
    title: the article title
    image_url: the image URL for this article
    body: the body text for this article
    sections: The firebase document id's of this article's sections
*/
class PublishedArticle {
    constructor(data) {
        console.log(data);
        this.id = data.article_id;
        this.title = data.title;
        this.image_url = data.image_url;
        this.type = data.type;
        this.created = data.created;
        this.updated = data.updated;
        this.liked_users = data.liked_users;
        this.strikes = data.strikes;
        this.sections = [];
        this.sources = [];
        data.sections.forEach((section, index) => {
            this.addSection(section, index);
        });
        data.sources.forEach((source) => {
            this.addSource(source);
        });
    }
    addSection(sectionData, index) {
        const section_id = sectionData.section_id;
        const version_id = sectionData.current_version;
        const type = sectionData.type;
        const body = sectionData.body;
        var newSection = new ArticleSection(this.article_id, section_id, version_id, type, body, index, []);
        this.sections.push(newSection);
    }
    addSource(sourceData) {
        const source_id = sourceData.source_id;
        const url = sourceData.url;
        const deleted = sourceData.deleted;
        const user_id = sourceData.user;
        const section_id = sourceData.section;
        const created = sourceData.created;
        var newSource = new Source(this.article_id, source_id, url, deleted, user_id, section_id, created);
        this.sources.push(newSource);
    }
}

export default PublishedArticle;