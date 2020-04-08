import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'

let screenWidth = Dimensions.get('window').width;

export const CardOrder = (props) => {
    let dateEn = new Date(props.item._data.created_at)
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let date = dateEn.toLocaleDateString("es-ES", options).toString();
    return (
        <View style={[styles.card, {backgroundColor: props.color}]}>
            <View style={styles.viewHeader}>
                <Text style={styles.price}>${props.item._data.total} </Text>
                <Text style={styles.status}> {getStatus(props.item._data.status) } </Text>
            </View>
            <Text style={styles.storeName}>{props.item._data.store_name}</Text>
            <View style={styles.viewBody}>
                <Text style={styles.text}>{props.item._data.address}</Text>
                <View style={styles.footerDate}>
                    <Text style={styles.text}>{date}</Text>
                    <Text style={styles.text}>{ props.item._data.time }</Text>
                </View>
            </View>
        </View>
    )
}

export const ListOrder = (props) => {
    let dateEn = new Date(props.item._data.created_at)
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let date = dateEn.toLocaleDateString("es-ES", options).toString();
    return (
        <View style={styles.list}>
            <View style={{flex:2, paddingLeft:5}}>
                <Text style={styles.storeName1}>{props.item._data.store_name}</Text>
                <Text style={styles.storeName1}>{props.item._data.address}</Text>
                <Text style={styles.price1}>${props.item._data.total} </Text>
            </View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Text style={styles.text1}>{date}</Text>
                <Text style={styles.text1}>{ props.item._data.time }</Text>
                <Text style={styles.status1}> { getStatus(props.item._data.status) } </Text>
            </View>
        </View>
    )
}

const getStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'Pendiente'
        case 'processing':
            return 'Procesando'
        case 'unapproved':
            return 'Por aprobar'
        case 'approved':
            return 'Aprobado'
        case 'dispatched':
            return 'Despachado'
        case 'delivered':
            return 'Entregado'
        case 'cancelled':
            return 'Cancelado'
        default:
            break;
    }
}

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

const styles = StyleSheet.create({
    viewHeader:{
        flexDirection:'row',
        height:scaleToDimension(40), 
        width:scaleToDimension(200), 
        marginHorizontal:10
    },
    viewBody:{
        height:scaleToDimension(50), 
        width:scaleToDimension(200), 
    },
    text:{
        fontWeight:'bold',
        marginLeft:10,
        color:'white',
        alignSelf:'center'
    },
    card : {
        height:scaleToDimension(110), 
        width:scaleToDimension(230), 
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
        shadowRadius: 6,

        elevation: 3,
        borderRadius:12
    },
    list : {

        backgroundColor:'red',
        flexDirection:'row',
        height:scaleToDimension(110), 
        width:'100%', 
        marginBottom:3,
        backgroundColor:'#ffffff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        elevation: 2,
  
    },
    storeName:{
        color:'#454442'
    },
    viewImg:{
        alignItems:'center',
        borderRadius:30
    },
    title:{
        alignSelf:'center', 
        marginHorizontal:15, 
        marginVertical:5,
        fontSize:16,
        color:'#78b3a3',
        textAlign: "center",
        fontFamily:'Ubuntu-Bold'
    },
    titleHeader:{
        fontSize:16,
        marginHorizontal:10,
        marginVertical:10,
        color:'white',
        fontFamily:'Ubuntu-Bold',
        fontWeight: 'bold',
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
    footerDate:{
        marginBottom:10,
        flexDirection:'row',
        justifyContent:'center'
    },
    buttonText:{
        fontFamily:'Ubuntu-Bold', 
        color:'white', 
        fontSize:16
    },
    price:{
        textAlign:'left',
        color:'white',
        fontWeight: 'bold',
        marginHorizontal:10,
        marginTop:10,
        fontFamily:'Ubuntu-Bold', 
        fontSize:24
    },
    price1:{
        color:'#28c996',
        fontWeight: 'bold',
        marginHorizontal:10,
        marginTop:10,
        fontFamily:'Ubuntu-Bold', 
        fontSize:18
    },
    status:{
        //textAlign:'right',
        color:'white',
        marginTop:10,
        marginRight:5,
        marginHorizontal:12,
        fontFamily:'Ubuntu-Bold', 
    },
    status1:{
        marginTop:10,
        justifyContent:'center',
        alignItems:'center',
        fontFamily:'Ubuntu-Bold', 
    },
    storeName1:{
        fontSize:14,
        marginHorizontal:10,
    },
    text1:{
        justifyContent:'center',
        alignItems:'center'
    }
})
