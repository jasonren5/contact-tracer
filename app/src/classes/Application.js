const { Timestamp } = require("@google-cloud/firestore");

class Application {
    constructor(id, data) {
        this.application_id = id;
        
        this.body = (data.body ? data.body : "");
        this.status = (data.status ? data.status : "pending");
        this.type = (data.type ? data.type : "general");
        this.user_id = (data.user_id ? data.user_id : "-1");
        this.submitted = (data.submitted ? data.submitted : Timestamp.now());
        this.reviewBody = data.review_body;
    }
}

export default Application;