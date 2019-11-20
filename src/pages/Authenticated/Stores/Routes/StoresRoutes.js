import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import OrderTransitions from '../Orders/OrderTransitions';
import ProductsTransitions from '../Products/ProductsTransitions'
import HomeStoreTransitions from '../Home/HomeStoreTransitions';


export const StackHomeStore = createStackNavigator({
    home: {
      screen: HomeStoreTransitions,
      navigationOptions: {
        header: null
      }
    }
},{
  headerMode:'none'
});

export const StackProducts = createStackNavigator({
    home: {
      screen: ProductsTransitions,
      navigationOptions: {
          header: null
      }
    },
})

export const StackOrders = createStackNavigator({
  home: {
    screen: OrderTransitions,
    navigationOptions: {
        header: null
    }
  },
})
  
export const TabBarStores = createBottomTabNavigator(
  {
    Orders: {
      screen: StackOrders,
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          <Image 
          style= { focused ? styles.inactive2 : styles.inactive }
          source={ focused ? require('../../../../../assets/icons/basket-100.png') : require('../../../../../assets/icons/logo-100.png')}/>
      },
    },
    HomeStore: {
      screen: StackHomeStore,
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <Image 
          style= { styles.activeplus }
          source={ focused ? require('../../../../../assets/icons/plus-active.png') : require('../../../../../assets/icons/plus-100.png')}/>
      }
    },
    Products: {
      screen: StackProducts,
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          <Image 
          style= { styles.inactive2 }
          source={ focused ? require('../../../../../assets/icons/products-black.png') : require('../../../../../assets/icons/products-white.png')}/>
      }
    }
  },
  {
    initialRouteName: "HomeStore",
    tabBarOptions: {
      activeTintColor: 'orange',
      inactiveTintColor: 'gray',
      showLabel: false,
    }
  },
);


const styles = StyleSheet.create({
  inactive: {
      height: 40,
      width: 40
  },
  inactive2: {
    height: 30,
    width: 30
  },
  activeplus: {
    height: 41,
    width: 41
  }
});