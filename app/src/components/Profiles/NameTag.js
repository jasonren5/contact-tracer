import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';

class NameTag extends React.Component {
    render() {
        const isMod = (this.props.user.expertises ? this.props.user.expertises.length > 0 : false);
        const isAdmin = (this.props.user.admin ? this.props.user.admin : false);
        const name = (this.props.user.displayName ? this.props.user.displayName : "Anonymous User");
        const url = (this.props.user.user_id ? "/user/" + this.props.user.user_id : "/user-not-found");
        const expertString = (isMod ? "Expertise in: \n" + this.props.user.expertises.join(",\n ") : "No expertises to show.")

        return (
            <Typography variant={this.props.variant}>
                <Link href={url}>
                    {name}
                </Link>
                { isMod &&
                    <Tooltip title={expertString} arrow>
                        <Chip label="Expert" color="primary" size="small" style={chipStyles} />
                    </Tooltip>
                }
                { isAdmin && <Chip label="Admin" color="secondary" size="small" style={chipStyles} />}
            </Typography>
        )
    }
}

const chipStyles = {
    margin: 5
}

export default NameTag;