/*
    Stores article section information.
    article_id: the document id of the article this section is associated with.
    id: UID tied to firebase document id to identify the section.
    type: string tied to users collection "username" field.
    body: the body text for this section
    edits: The firebase document id's of this section's
*/
class ArticleSection {
    constructor(article_id, id, type, body, edits) {
        this.article_id = article_id;
        this.id = id;
        this.type = type;
        this.body = body;
        this.edits = edits;
    }
}

export default ArticleSection;