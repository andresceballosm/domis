import React, { Component } from 'react'
import Geocoder from 'react-native-geocoding';
import {  Modal, View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import DeliveryForm from '../pages/Authenticated/Clients/Orders/DeliveryForm';
import { MapsComponent } from './MapsComponent';

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMap: false, 
            location: null,
            address: '',
            phone : '',
            detail: ''
        };
    }
    
    getGeolocation = () => {
        this.setState({ showMap : true })
        const address = this.state.address;
        Geocoder.from(address)
        .then(json => {
            var location = json.results[0].geometry.location;
            console.log(location);
            this.setState({location})
        })
        .catch(error => console.warn(error));
    };

    getAddress = (lat,lng) => { 
        Geocoder.from(lat,lng)
        .then(json => {
            console.log('json', json);
        		var addressComponent = json.results[0].address_components[1].long_name + ' # ' + json.results[0].address_components[0].long_name;
                this.setState({address : addressComponent})
                console.log('addressComponent',addressComponent);
        })
        .catch(error => console.warn(error));
    }

    updateCoordinate = (coordinates) => {
        console.log('New coordenadas', coordinates)
        this.getAddress(coordinates.latitude, coordinates.longitude)
    };

    validateAddress = () => {
        try {
            return this.props.dataUser.address.length > 0    
        } catch (error) {
            return false;
        }
    };

    updatePositionAddress = (positions, oldPosition, newPosition) => {
        var element = positions[oldPosition];
        positions.splice(oldPosition, 1);
        positions.splice(newPosition, 0, element);
        return positions;
    };

    updateAddress = (index) => {
        let positions = this.props.dataUser.address;
        this.props.dataUser.address.filter((item , i) => {
            if(i === index){
                let newPositions = this.updatePositionAddress(positions, i, 0 ); 
                console.log('newPositions',newPositions)
                this.props.updateAddressPosition(newPositions)
            }
        })
    }

    render(){
        const { address,phone,detail } = this.state;
        const { dataUser } = this.props;
        let valid1 = phone != '' && address != '';

        if( this.state.address === '' && this.props.addressLocation ){
            this.setState({ address : this.props.addressLocation })
        }

        return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.visibleAddress}>
                { !this.state.showMap ?
                <View style={styles.modalBackground}>
                    <View style={{flex:1, flexDirection:'row', marginTop:10, marginBottom:20}}>
                        <View style={{flex:5}} >
                            <Text style={{
                                marginLeft: 15,
                                color: '#58647a',
                                fontSize: 30,
                                fontWeight: 'bold'
                            }}>Agrega o selecciona una dirección</Text>
                        </View>
                        <TouchableOpacity style={{flex:1, marginTop:5}} onPress={this.props.close}>
                            <Text style={{
                                color: '#78b3a3',
                                marginLeft: 15,
                                fontSize: 25,
                                fontWeight: 'bold'
                            }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex:4,marginTop:40, paddingHorizontal:20, width:'90%' }}>         
                        <DeliveryForm 
                        validate ={  valid1 }
                        setAddress={(address) => this.setState({address})}
                        address={address}
                        setPhone={(phone) => this.setState({phone})}
                        phone={phone}
                        showPhone={true}
                        addOrder={this.getGeolocation} 
                        buttonName="Elegir"/>
                    </View> 
                    <View style={{flex:3, width:'90%'}}>
                        { this.validateAddress() && (
                            <FlatList 
                            extraData={dataUser.address}
                            data={dataUser.address}
                            renderItem={({item, index}) => {
                                return (
                                    <TouchableOpacity 
                                    key={index}
                                    onPress={() => this.updateAddress(index)}
                                    style={styles.list}>
                                        <View style={{flex:4}}>
                                            <Text style={styles.title}>{item.address}</Text>
                                            <Text style={styles.sub}>{item.phone}</Text>
                                            <Text style={styles.sub}>{item.detail}</Text>
                                        </View>
                                        { index === 0 && (
                                            <View  style={{flex:1}}>
                                                <Image style={{width:30, height:30}}
                                                source={require('../../assets/icons/check.png')}/>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )
                            }}
                            />
                        )}
                    </View>
                </View> 
                :
                <View style={styles.modalBackground}>
                    <View style={{flex:1, flexDirection:'row', marginTop:10, marginBottom:20}}>
                        <View style={{flex:3}} >
                            <Text style={{
                                marginLeft: 15,
                                color: '#58647a',
                                fontSize: 30,
                                fontWeight: 'bold'
                            }}>Confirmar dirección</Text>
                        </View>
                        <TouchableOpacity 
                        style={{flex:1, marginTop:5}} 
                        onPress={() => this.setState({ showMap : false })}>
                            <Text style={{
                                color: '#78b3a3',
                                marginLeft: 15,
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}>Regresar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex:2,marginTop:20, paddingHorizontal:20 }}>
                        { this.state.location && (
                        <MapsComponent 
                        newCoordinates = { (coordinates) => this.updateCoordinate(coordinates)}
                        draggable={true}
                        width={400}
                        height={700}
                        latitude={this.state.location.lat} 
                        longitude={this.state.location.lng}  
                        storeName="Mi dirección"
                        />   
                        )}
                    </View>
                    <View style={{ flex:3,marginTop:10, paddingHorizontal:20 }}>         
                        <DeliveryForm 
                        validate = { true }
                        setAddress={(address) => this.setState({address})}
                        address={this.state.address}
                        setDetail={(detail) => this.setState({detail})}
                        detail={detail}
                        showDetail={true}
                        showPhone={false}
                        addOrder={() => { 
                            this.setState({showMap: false}), 
                            this.props.addAddress(address,phone,detail)
                        }} 
                        buttonName="Guardar"/>
                    </View> 
                </View> 
                } 
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height:'100%'
    },
    title : { 
        fontFamily:'Ubuntu-Bold', 
        fontSize:14
    },
    sub: { 
        fontSize:12,
        color:'#58647a'
    },
    list: { 
        flexDirection:'row', 
        padding:10, 
        borderBottomWidth:.2
    }
})

export default Address;