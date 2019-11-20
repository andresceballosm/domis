import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity,Dimensions } from 'react-native'

let screenWidth = Dimensions.get('window').width;

export const CardBasket = (props) => {
    return (
        <View style={styles.card}>
            <View style={styles.viewImg}>
                <Image style={{height:scaleToDimension(60),width:scaleToDimension(60)}}
                    source={ props.item.image ? 
                            { uri: props.item.image } 
                            : require('../../assets/icons/basket-100.png')
                    }
                />
            </View>
            <View style={styles.data}>
                <Text style={styles.title}> {props.item.name} </Text>
                <Text style={styles.subtitle}> {props.item.brand} / { props.item.quantity }  {props.item.unity} </Text>
                <Text style={styles.title}>${props.item.price} </Text>
            </View>
            <View style={styles.viewIcons}>
                <TouchableOpacity 
                style={styles.iconDelete}
                onPress={() => { props.deleteProduct(props.item.id)}}>
                    <Image style={{height:scaleToDimension(25),width:scaleToDimension(25)}}
                    source={require('../../assets/icons/delete.png')}/>
                </TouchableOpacity>
                <View style={styles.viewQuantity}>
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => { 
                        if(props.enabled){
                            props.clickReduce(props.item.id)}}
                        }
                    >
                        <Image style={{height:scaleToDimension(25),width:scaleToDimension(25)}}
                        source={require('../../assets/icons/minus.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{props.item.quantityProduct}</Text>
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => { 
                        if(props.enabled){
                            props.clickAdd(props.item.id)}}
                        }
                    >
                        <Image style={{height:scaleToDimension(25),width:scaleToDimension(25)}}
                        source={require('../../assets/icons/plus-green.png')}/>
                    </TouchableOpacity>
                </View>   
            </View>
        </View>
    )
}

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

const styles = StyleSheet.create({
    card : {
        flex:1, 
        flexDirection:'row',
        marginTop:5,
        marginBottom:5, 
        marginHorizontal:12,
        backgroundColor:'#ffffff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        borderRadius:15
    },
    viewImg:{
        flex:1,
        alignItems:'center',
        marginHorizontal:5,
        justifyContent:'center',
        borderRadius:30
    },
    title:{
        alignSelf:'center', 
        marginHorizontal:15, 
        marginVertical:5,
        fontSize:14,
        color:'black',
        textAlign: "center",
        fontFamily:'Ubuntu-Bold'
    },
    subtitle:{
        alignSelf:'center', 
        marginHorizontal:15, 
        fontSize:12,
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
    viewQuantity:{
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    button:{
        marginHorizontal:5
    },
    quantity:{
        textAlign:'center',
        fontFamily:'Ubuntu-Bold',
        fontSize:16
    },
    iconDelete:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    data:{
        flex:3, 
        marginHorizontal:10,
    },
    viewIcons:{
        flex:.5, 
        marginHorizontal:12, 
        justifyContent:'center', 
        alignItems:'center'
    }
})
