/*
    Stores article section version information.
    article_id: the document id of the article this section is associated with.
    section_id: the document id of the section this version is associated with.
    id: UID tied to firebase document id to identify this version.
    previous_version_id: the document id of the previous version.
    user_id: the user id of the publisher of this version.
    body: the body text for this version of the section.
*/
class SectionVersion {
    constructor(article_id, section_id, id, previous_version_id, user_id, body) {
        this.article_id = article_id;
        this.section_id = section_id;
        this.id = id;
        this.previous_version_id = previous_version_id;
        this.user_id = user_id;
        this.body = body;
    }
}