import { Alert } from 'react-native';

export const showAlertError = (message) => {
    setTimeout( () => {	
        Alert.alert(
            'Error!',
            message,
            [
                {   text: 'ok', onPress: () =>  console.log('error')},
            ],
            { cancelable: false },   
        );
    },600)
}

export const showAlertSuccess = (message) => {
    setTimeout( () => {	
        Alert.alert(
            'Info!',
            message,
            [
                {   text: 'ok', onPress: () =>  console.log('error')},
            ],
            { cancelable: false },   
        );
    },600)
}