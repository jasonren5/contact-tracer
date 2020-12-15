import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import NameTag from '../../Profiles/NameTag';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

class ArticleContributors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numContributors: props.contributors.length,
            contributors: props.contributors
        }
    }

    getTopContributors() {
        var contributors = this.state.contributors.sort((a, b) => {
            return a.numContributions - b.numContributions;
        })

        if (contributors.length > 5) {
            contributors = contributors.slice(0, 5);
        }

        return (
            <div style={tooltipStyles}>
                <Typography variant="body1">Top Contributors</Typography>
                <Divider />
                {contributors.map((user) =>
                    <NameTag key={user.displayName} variant="body1" user={user} />
                )}
            </div>
        )
    }

    render() {
        return (
            <Tooltip
                title={
                    <React.Fragment>
                        {this.getTopContributors()}
                    </React.Fragment>
                }
                interactive
                arrow
            >
                <IconButton color="secondary">
                    <PeopleIcon></PeopleIcon>
                    {this.state.numContributors}
                </IconButton>
            </Tooltip>
        )
    }
}

const tooltipStyles = {
    backgroundColor: "white",
    color: 'rgba(1, 1, 1, 0.87)',
    padding: 5
}

export default ArticleContributors;