import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { fieldInput, fieldInputFloat } from '../../../components/Fields';
import { ButtonRegister } from '../../../components/ButtonRegister';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = '*';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Correo Inválido';
  }

  if (!values.password) {
    errors.password = '*';
  } else if (values.password.length < 6) {
    errors.password = 'Minimo 6 caraáteres';
  } else if (values.password.length > 15) {
    errors.password = 'Maximo 15 carácteres';
  }

  return errors;
};

const SignInForm = (props) => {
  return (
      <View>
        <View style={styles.body}>
            <Field 
            name="email" 
            label="Correo electrónico" 
            keyboardType="email-address" 
            component={fieldInputFloat} 
            ph="email@email.com" />
            <Field 
            name="password" 
            label="Contraseña" 
            component={fieldInputFloat} 
            password={true} 
            ph="******" />
        </View>
        <View style={{alignItems:'flex-end', marginTop:10}}>
          <TouchableOpacity onPress={()=> props.forgotPassword()}>
            <Text style={styles.textForget}> Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
            <ButtonRegister 
            title="Ingresar" 
            click={  props.login }                           
            invalid={ props.invalid } 
            color="black"
            />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  body:{
    alignItems:'center'
  },
  button: {
      paddingTop:20,
      alignItems:'center'
  },
  textForget:{
    fontFamily:'Ubuntu-Bold',
    fontSize:12,
    color:'#7a7a7a'
  }
});

export default reduxForm({
  form: 'SignInForm',
  validate,
})(SignInForm);
