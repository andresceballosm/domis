import React from 'react'
import { FluidNavigator } from 'react-navigation-fluid-transitions'
import OrdersScreen from './OrdersScreen'
import OrderDetail from './OrderDetail';

const Navigator = FluidNavigator({
    orders: { screen: OrdersScreen },
    orderDetail: { screen: OrderDetail },
});

class OrderTransitions extends React.Component {
    static router = Navigator.router;
    render() {
        const {navigation} = this.props;
        return (
            <Navigator navigation={navigation}/>
        );
    }
}

export default OrderTransitions;
