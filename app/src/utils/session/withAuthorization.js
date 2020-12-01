import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../firebase';

import ForceSignInModal from '../../components/Auth/ForceSignInModal';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                openModal: false,
            }
            this.handleCloseModal = this.handleCloseModal.bind(this);
        }
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        this.setState({
                            openModal: true
                        });
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        handleCloseModal() {
            this.setState({
                openModal: false
            });
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ?
                            <Component {...this.props} user={authUser} />
                            :
                            <ForceSignInModal
                                isOpen={this.state.openModal}
                                accessPage
                                closeModal={this.handleCloseModal}
                            />
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export const userLoggedInCondition = authUser => !!authUser;

export default withAuthorization;

