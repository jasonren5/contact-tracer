/*
    Stores article section information.
    article_id: the document id of the article this section is associated with.
    id: UID tied to firebase document id to identify the section.
    type: int detailing type of section (0 for text, 1 for image URL)
    body: the body text for this section
    edits: The firebase document id's of this section's
*/
class ArticleSection {
    constructor(article_id, id, version_id, type, body, order, edits) {
        this.article_id = article_id;
        this.id = id;
        this.version_id = version_id;
        this.type = type;
        this.body = body;
        this.order = order;
        this.edits = edits;
    }
}

export default ArticleSection;