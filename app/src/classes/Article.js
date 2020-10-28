/*
    Stores article information.
    id: UID tied to firebase document id to identify the article.
    title: the article title
    image_url: the image URL for this article
    body: the body text for this article
    sections: The firebase document id's of this article's sections
*/
class Article {
    constructor(id, title, image_url, body, sections) {
        this.id = id;
        this.title = title;
        this.image_url = image_url;
        this.body = body;
        this.sections = sections;
    }
}

export default Article;