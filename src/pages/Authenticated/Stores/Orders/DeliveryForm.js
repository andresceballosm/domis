import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Dimensions } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { fieldInputOrder, fieldInputNumber } from '../../../../components/Fields';
import { ButtonRegister } from '../../../../components/ButtonRegister';

const validate = (values) => {
    const errors = {};
  
    if (!values.address) {
        errors.address = '*';
    }
    if (!values.phone) {
        errors.phone = '*';
    }
    
    return errors;
};

let screenWidth = Dimensions.get('window').width;

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

class DeliveryForm extends Component {
    state={
        loadData: false
    }
    render(){
        if(this.props.data.length !== null && this.state.loadData === false){
            if(this.props.data.length !== 0 && !this.props.data.error){
                this.setState({loadData:true})
                const data = {
                    address : this.props.data.address,
                    phone :  this.props.data.phone.toString()
                }
                this.props.initialize(data)
            }
        }
        return (
            <KeyboardAvoidingView>
                <ScrollView style={{height:scaleToDimension(140)}}>
                    <Field 
                    name="address" 
                    editable={this.props.editable}
                    label="Dirección" 
                    placeholder='Kr 19 # 155-22 Edificio Prueba apto 402'
                    component={fieldInputOrder}
                    />
                    <Field 
                    name="phone" 
                    editable={this.props.editable}
                    label="Teléfono" 
                    keyboardType = "phone-pad"
                    placeholder="Teléfono para contactarlo si es necesario"
                    component={fieldInputNumber}
                    />
                    { this.props.note ?
                    <Field 
                    name="note" 
                    placeholder="Agregue una nota si es necesario"
                    label="Nota" 
                    component={fieldInputOrder}
                    />
                    :<View></View>
                    }
                </ScrollView>
                { this.props.editable ?
                <View style={{ 
                    height: scaleToDimension(70),
                    alignItems:'center',
                    justifyContent:'center',
                    paddingBottom:15
                }}>
                    <ButtonRegister 
                    title={this.props.buttonName} 
                    click={  this.props.addOrder }                           
                    invalid={ this.props.invalid } 
                    color="black"
                    />
                </View> : <View></View>
                }
            </KeyboardAvoidingView>
        )
    }
}

export default reduxForm({
    form: 'DeliveryForm',
    validate,
  })(DeliveryForm);