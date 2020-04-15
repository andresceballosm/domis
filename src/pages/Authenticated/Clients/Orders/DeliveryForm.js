import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Dimensions } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { fieldInputOrder, fieldInputNumber, FieldInputOrder, FieldInputNumber } from '../../../../components/Fields';
import { ButtonRegister } from '../../../../components/ButtonRegister';


let screenWidth = Dimensions.get('window').width;

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

class DeliveryForm extends Component {
    state={
        loadData: false,
        address : ''
    }
    render(){
        console.log('this.props.validate', this.props.validate)
        if(this.props.data !== null && this.state.loadData === false && this.props.data !== undefined) {
            if(this.props.data !== null) {
                this.setState({loadData:true})
                const data = {
                    address : this.props.data.address,
                    phone :  this.props.data.phone.toString()
                }
                this.props.initialize(data)
            }
        } else if(this.props.data !== null && this.props.data !== undefined) {
            console.log('this.props', this.props);
            const data = {
                address : this.props.data.address,
                phone :  this.props.data.phone.toString()
            }
            this.props.initialize(data)
        }

        return (
            <KeyboardAvoidingView>
                <View style={{height:scaleToDimension(140)}}>
                    <FieldInputOrder 
                    label="Dirección" 
                    placeholder='Kr 19 # 155-22'
                    value={this.props.address}
                    onChange = {(address) => this.props.setAddress(address)}
                    />
                    <View style={{height:10}} />
                    { this.props.showDetail && (
                    <FieldInputOrder 
                    label="Detalle" 
                    placeholder='Agregar apto, bloque, piso, casa'
                    value={this.props.detail}
                    onChange = {(detail) => this.props.setDetail(detail)}
                    />
                    )}
                    <View style={{height:10}} />
                    { this.props.showPhone && (
                    <FieldInputNumber 
                    value={this.props.phone}
                    onChange = {(phone) => this.props.setPhone(phone)}
                    label="Teléfono" 
                    keyboardType = "phone-pad"
                    placeholder="Teléfono para contactarlo si es necesario"
                    />
                    )}
                </View>

                <View style={{ 
                    height: scaleToDimension(70),
                    alignItems:'center',
                    justifyContent:'center',
                    marginTop:10
                }}>
                    <ButtonRegister 
                    title={this.props.buttonName} 
                    click={  this.props.addOrder }                           
                    invalid={ !this.props.validate } 
                    color="black"
                    />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

export default DeliveryForm
