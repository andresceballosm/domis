import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';

export const AlertResponse= (props) => {
    console.log(props)
    const showAlert = () => {
        message = props.msg;
        setTimeout( () => {	
            Alert.alert(
                'Info',
                message,
                [
                    {   text: 'ok', onPress: () => props.closeModal },
                ],
                { cancelable: false },   
            );
        },600)
    }

    return (
        <View>
            { showAlert()}
        </View>
    )   
}

const styles = StyleSheet.create ({
    button: {
       backgroundColor: '#4ba37b',
       width: 100,
       borderRadius: 50,
       alignItems: 'center',
       marginTop: 100
    }
 });
