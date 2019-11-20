import React, { Component } from 'react'
import { Animated, Image } from 'react-native'

export default class DownAnimation extends React.Component {
    state = {
      animation: new Animated.Value(0)
    }

    componentDidMount() {
        Animated.spring(
          this.state.animation,
          {
            toValue: 250,
            duration: 2000,
            friction: 1,
            tension: 20
          }
        ).start();
    }
  
    render() {
      const animationStyles = {
        transform: [
          { translateY: this.state.animation }
        ]
      };
  
      return (
        <Animated.View style={[objectStyles.object, animationStyles]}>
             <Image style={{height:30, width:30}}
                 source={require('../../assets/icons/down.png')}/>
        </Animated.View>
      );
    }
}

const objectStyles = {
    object: {
      backgroundColor: 'orange',
      width: 100,
      height: 100
    }
  }

