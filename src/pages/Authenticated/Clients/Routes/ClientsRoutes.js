import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import HomeTransitions from '../Home/HomeTransitions'
import ProfileTransitions from '../Profile/ProfileTransitions'
import OrdersScreen from '../Orders/OrdersScreen';
import OrderDetail from '../Orders/OrderDetail';
import { OrderedSet } from 'immutable';
import OrderTransitions from '../Orders/OrderTransitions';


export const StackHome = createStackNavigator({
    home: {
      screen: HomeTransitions,
      navigationOptions: {
        header: null
      }
    }
},{
  headerMode:'none'
});

export const StackProfile = createStackNavigator({
    home: {
      screen: ProfileTransitions,
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
  
export const TabBarClients = createBottomTabNavigator(
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
    Home: {
      screen: StackHome,
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <Image 
          style= { styles.activeplus }
          source={ focused ? require('../../../../../assets/icons/plus-active.png') : require('../../../../../assets/icons/plus-100.png')}/>
      }
    },
    Profile: {
      screen: StackProfile,
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          <Image 
          style= { styles.inactive2 }
          source={ focused ? require('../../../../../assets/icons/profile-active.png') : require('../../../../../assets/icons/profile-100.png')}/>
      }
    }
  },
  {
    initialRouteName: "Home",
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