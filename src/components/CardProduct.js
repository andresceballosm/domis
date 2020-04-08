import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'

export const CardProduct = (props) => {
    return (
        <View style={styles.card}>
            <View style={styles.viewImg}>
                <Image style={{height:90,width:90, marginTop:5}}
                    source={ props.item._data.image ? 
                            { uri: props.item._data.image } 
                            : require('../../assets/icons/basket-100.png')
                    }
                />
            </View>
            <Text style={styles.title}> {props.item._data.name} </Text>
            <Text style={styles.subtitle}> {props.item._data.brand} / {props.item._data.quantity}  {props.item._data.unity} </Text>
            <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text style={styles.title}>{validateMoney(props.item._data.money)} {props.item._data.price} </Text>
            </View>
            <View style={styles.footer}>
                <View style={{backgroundColor:'#78b3a3', borderRadius:10, alignItems:'center',justifyContent:'center', marginTop:5, width:90, height:30}}>
                    <TouchableOpacity onPress={(event) => { props.click(props.item)}}>
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>  
            </View>
        </View>
    )
}

const validateMoney = ( money ) => {
    switch (money) {
        case 'USD':
            return 'USD'
        case 'EUR':
            return '€'
        case 'COP':
            return '$'
        default:
            return '$';
    }
}

export const CardProductStore = (props) => {
    return (
        <View style={styles.cardStore}>
            <View style={[styles.viewImg], { flex:1, marginLeft:5}}>
                <Image style={{height:80,width:80, marginTop:5}}
                    source={ props.item._data.image ? 
                            { uri: props.item._data.image } 
                            : require('../../assets/icons/basket-100.png')
                    }
                />
            </View>
            <View style={{flex:2}}>
                <Text style={styles.title}> {props.item._data.name} </Text>
                <Text style={styles.subtitle}> {props.item._data.brand} / {props.item._data.quantity}  {props.item._data.unity} </Text>
                <Text style={styles.title}>{validateMoney(props.item._data.money)} {props.item._data.price} </Text>
            </View>
            <View style={[styles.footer], { flex:1}}>
                <View style={[ styles.buttonAction, {backgroundColor:'rgba(52, 52, 52, 0.9)'}]}>
                    <TouchableOpacity onPress={(event) => { props.click(props.item)}}>
                        <Text style={styles.buttonTextStore}>Editar</Text>
                    </TouchableOpacity>
                </View>  
                { props.item._data.active === false ?
                <View style={[styles.buttonAction, { backgroundColor:'#78b3a3' }]}>
                    <TouchableOpacity onPress={(event) => { props.active(props.item)}}>
                        <Text style={styles.buttonTextStore}>Habilitar</Text>
                    </TouchableOpacity>
                </View> :
                <View style={[styles.buttonAction, { backgroundColor:'#b8444a' }]}>
                    <TouchableOpacity onPress={(event) => { props.disable(props.item)}}>
                        <Text style={styles.buttonTextStore}>Inhabilitar</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card : {
        flex:1, 
        marginTop:10, 
        marginBottom:10,
        marginLeft:7, 
        marginRight:7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 3,
        borderRadius:10
    },
    cardStore:{
        flex:1, 
        flexDirection:'row',
        marginTop:10, 
        marginBottom:10,
        marginLeft:7, 
        marginRight:7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 3,
        borderRadius:10
    },
    viewImg:{
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30
    },
    title:{
        alignSelf:'center', 
        marginHorizontal:15, 
        marginVertical:5,
        fontSize:16,
        color:'black',
        textAlign: "center",
        fontFamily:'Ubuntu-Bold'
    },
    subtitle:{
        alignSelf:'center', 
        marginHorizontal:15, 
        marginVertical:5,
        fontSize:14,
        color:'#58647a',
        textAlign: "center",
        fontFamily:'Ubuntu-Bold'
    },
    footer:{
        marginBottom:10,
        flexDirection:'row'
    },
    buttonText:{
        fontFamily:'Ubuntu-Bold', 
        color:'white', 
        fontSize:16
    },
    buttonTextStore:{
        fontFamily:'Ubuntu-Bold', 
        color:'white', 
        fontSize:12
    },
    buttonAction:{
        borderRadius:10, 
        alignItems:'center',
        justifyContent:'center', 
        marginTop:5, 
        width:80, 
        height:30
    }
})
