import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'


export const CardOrderDetail = (props) => {
    const total = parseInt(props.product.price) * parseInt(props.item.quantityProduct)
    const unidad = props.item.quantity > 1 ? 'unidades' : 'unidad'
    return (
        <View style={styles.card}>
            <View style={styles.viewImg}>
                <Image style={{height:100,width:100, marginTop:5}}
                    source={ props.item.image ? 
                            { uri: props.item.image } 
                            : require('../../assets/icons/basket-100.png')
                    }
                />
            </View>
            <View style={styles.infoProduct}>
                <Text style={styles.title}> {props.product.name} </Text>
                <Text style={props.item.quantityProduct == 0 ? styles.subtitleRed : styles.subtitle}> Marca: {props.product.brand} / {props.product.quantity} {props.product.unity}</Text>
                <Text style={props.item.quantityProduct == 0 ? styles.subtitleRed : styles.subtitle}> ${props.product.price} x {props.item.quantityProduct} {unidad}</Text>
                { props.item.quantityProduct == 0 ? 
                <Text style={styles.subtitleRed}>Agotado</Text> : <View></View>
                }
                <View style={styles.footer}>
                    <View style={{alignItems:'center', justifyContent:'center'}}>
                        <Text style={props.item.quantityProduct == 0 ? styles.titleRed : styles.title} style={styles.title}>${total} </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    card : {
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
    infoProduct:{
        flex:3,
        marginRight:15
    },
    viewImg:{
        flex:1,
        marginLeft:5,
        alignItems:'center',
        borderRadius:30
    },
    title:{
        //alignSelf:'center', 
        marginHorizontal:15, 
        marginTop:10,
        fontSize:16,
        color:'black',
        fontFamily:'Ubuntu-Bold'
    },
    titleRed:{
        marginHorizontal:15, 
        marginTop:10,
        fontSize:16,
        color:'#964b4e',
        fontFamily:'Ubuntu-Bold'
    },
    subtitle:{
        marginLeft:15,
        marginTop:3,
        fontSize:14,
        color:'#58647a',
        fontFamily:'Ubuntu-Bold'
    },
    subtitleRed:{
        marginLeft:15,
        marginTop:3,
        fontSize:14,
        color:'#964b4e',
        fontFamily:'Ubuntu-Bold' 
    },
    footer:{
        marginBottom:10,
        flexDirection:'row'
    },
})
