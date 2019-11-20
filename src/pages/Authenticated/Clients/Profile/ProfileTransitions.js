import React from 'react';
import { FluidNavigator } from 'react-navigation-fluid-transitions';
import ProfileScreen from './ProfileScreen';
import DetailsScreen from './DetailsScreen';

const Navigator = FluidNavigator({
    profile: {screen: ProfileScreen},
    profileDetails: {screen: DetailsScreen},
});

class ProfileTransitions extends React.Component {
    static router = Navigator.router;
    render() {
        const {navigation} = this.props;
        return (
            <Navigator navigation={navigation}/>
        );
    }
}

export default ProfileTransitions;
