import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class ArticleContributions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numContributions: 0
        }
    }

    componentDidMount() {
        var total = 0;
        this.props.contributors.forEach(contributor => {
            total += contributor.numContributions;
        });
        this.setState({
            numContributions: total
        })
    }

    render () {
        return (
            <Tooltip title={this.state.numContributions.toString() + " Contributions"} >
                <IconButton>
                    <EditIcon />
                    {this.state.numContributions}
                </IconButton>
            </Tooltip>
        )
    }
}

export default ArticleContributions;