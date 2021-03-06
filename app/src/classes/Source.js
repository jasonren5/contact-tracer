/*
    Stores article source data.
    article_id: the document id of the article this source is associated with.
    id: UID tied to firebase document id to identify the source.
    URL: Source URL.
    deleted: If the source is still deleted (bool)
    user_id: User ID for user that published source
*/
class Source {
    constructor(article_id, id, url, deleted, user, section, created, order) {
        this.article_id = article_id;
        this.id = id;
        this.url = url;
        this.deleted = deleted;
        this.user = user;
        this.section = section;
        this.created = created;
        this.order = order;
    }
}

export default Source;