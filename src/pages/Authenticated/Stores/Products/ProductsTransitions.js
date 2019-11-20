import React from 'react';
import { FluidNavigator } from 'react-navigation-fluid-transitions';
import ProfileScreen from './ProductsScreen';
import DetailsScreen from './DetailsScreen';
import ProductsScreen from './ProductsScreen';
import EditProductScreen from './EditProductScreen';
import AddProductScreen from './AddProductScreen';
import AddCategoryScreen from './AddCategoryScreen';

const Navigator = FluidNavigator({
    profile: { screen: ProductsScreen },
    profileDetails: { screen: DetailsScreen },
    editProduct : { screen : EditProductScreen },
    addProduct : { screen : AddProductScreen },
    addCategory : { screen : AddCategoryScreen }
});

class ProductsTransitions extends React.Component {
    static router = Navigator.router;
    render() {
        const {navigation} = this.props;
        return (
            <Navigator navigation={navigation}/>
        );
    }
}

export default ProductsTransitions;
