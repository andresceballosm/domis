import React from 'react'
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

export const ButtonRegister = (props) => {
    return (
        <TouchableOpacity 
        activeOpacity={ props.invalid ? 1 : 0.3 } 
        disabled={props.invalid} 
        style={[styles.button, { backgroundColor: props.color, width: props.width ? props.width : 200}]}
        onPress={()=>{ props.click()}} >
            <Text style={{ color:'white',fontFamily:'Ubuntu-Bold', fontSize: props.fontSize ? props.fontSize : 20  }}>{ props.title }</Text>
        </TouchableOpacity>
    )
}

export const ButtonGeneral = (props) => {
    return (
        <TouchableOpacity 
        activeOpacity={ props.invalid ? 1 : 0.3 } 
        disabled={props.invalid} 
        style={[styles.button, { backgroundColor: props.color, width: props.width ? props.width : 200,  height: props.height ? props.height : 45}]}
        onPress={()=>{ props.click()}} >
            <Text style={{color:props.fontColor,fontFamily:'Ubuntu-Bold', fontSize:16}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export const ButtonBackDown = (props) => {
    return (
        <TouchableOpacity 
        onPress={()=>{ props.navigation.pop()}}
        style={styles.navigationHeaderContainer}>
            <Image style={props.imageStyle}
            source={require('../../assets/icons/down.png')}/>
        </TouchableOpacity>
    )
}

export const ButtonGoogle = (props) => {
    return (
        <TouchableOpacity 
        onPress={()=>{ props.click()}}
        style={styles.buttonGoogle}>
            <Image style={{width:30, height:30}}
            source={require('../../assets/icons/google.png')}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems:'center',
        height:45,
        borderRadius:20,
        justifyContent:'center',
        width:200
    },
    buttonSombra: {
        alignItems:'center',
        height:45,
        borderRadius:20,
        justifyContent:'center',
        width:200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        borderRadius:10
    },
    buttonGoogle:{
        alignItems:'center',
        height:60,
        borderRadius:180,
        justifyContent:'center',
        width:60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 3,  
    }
})