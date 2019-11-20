import React from 'react';
import { FluidNavigator } from 'react-navigation-fluid-transitions';
import DetailsScreen from './DetailsScreen';
import StoreScreen from '../Store/StoreScreen';
import BasketScreen from '../Orders/BasketScreen';
import HomeStoreScreen from './HomeStoreScreen';

const Navigator = FluidNavigator({
    home: { screen: HomeStoreScreen },
    homeDetails: { screen: DetailsScreen },
    store: { screen: StoreScreen },
    basket: { screen: BasketScreen }
});

class HomeStoreTransitions extends React.Component {
    static router = Navigator.router;
    render() {
        const {navigation} = this.props;
        return (
            <Navigator navigation={navigation}/>
        );
    }
}

export default HomeStoreTransitions;
