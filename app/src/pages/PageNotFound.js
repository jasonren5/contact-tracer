import React from 'react';

class PageNotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="PageNotFound">
                <h1> 404 Page Not Found, <a href="/">Return Home</a> </h1>
            </div>
        )
    }
}
export default PageNotFound;