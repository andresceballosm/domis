import { createStackNavigator } from 'react-navigation'
import SignIn from './SignIn';
import SignUp from './SignUp';

const StackNoAuthenticated = createStackNavigator({
    SignIn: {
      screen: SignIn,
      navigationOptions: {
          header: null
      }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },
});

export { StackNoAuthenticated };