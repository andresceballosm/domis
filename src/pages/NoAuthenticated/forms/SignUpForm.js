import React from 'react';
import { View, StyleSheet, Platform, Text, KeyboardAvoidingView } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { fieldInput } from '../../../components/Fields';
import { ButtonRegister } from '../../../components/ButtonRegister';

const validate = (values) => {
  const errors = {};

    if (!values.email) {
        errors.email = '*';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'invalidEmail';
    }

    if (!values.firstname) {
        errors.firstname = '*';
    }
    if (!values.lastname) {
        errors.lastname = '*';
    }

    if (!values.password) {
        errors.password = '*';
    } else if (values.password.length < 6) {
        errors.password = 'Minimo 6 caracteres';
    } else if (values.password.length > 15) {
        errors.password = 'Maximo 15 caracteres';
    }

    if (!values.confirmation) {
      errors.confirmation = '*';
    } else if (values.password !== values.confirmation) {
      errors.confirmation = 'Contraseña no coincide';
    }


  return errors;
};

const SignUpForm = (props) => {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.body}>
        <Field 
        name="firstname" 
        label="Nombre Completo" 
        component={fieldInput}
        />
        <Field 
        name="lastname" 
        label="Apellidos" 
        component={fieldInput}
        />
        <Field 
        name="email" 
        textContentType="emailAddress"
        label="Correo electrónico" 
        component={fieldInput} 
        keyboardType="email-address"
        ph="email@email.com" 
        />
        <Field 
        name="password" 
        label="Contraseña" 
        component={fieldInput} 
        password={true} 
        ph="******" 
        />
        <Field 
        name="confirmation" 
        label="Confirmar Contraseña" 
        component={fieldInput} 
        password={true} ph="******" 
        />
        <View style={styles.button}>
            <ButtonRegister 
            title="Registrar" 
            click={  props.register }                           
            invalid={ props.invalid } 
            color="black"
            />
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body:{
    alignItems:'center'
  },
  button: {
      paddingTop:40,
      paddingBottom:20
  }
});

export default reduxForm({
  form: 'SignUpForm',
  validate,
})(SignUpForm);
