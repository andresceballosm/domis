import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { fieldInputFloat, fieldSelectPicker, fieldSelectCategoriesPicker } from '../../../../components/Fields';
import { ButtonRegister } from '../../../../components/ButtonRegister';
import { validate } from './Errors';
import { Item, Form } from 'native-base';

const ProductForm = (props) => {
  console.log('props in form==',props);
  return (
    <View behavior="padding" style={styles.body}>
        <Field 
        name="name" 
        label="Nombre del producto" 
        component={fieldInputFloat}
        />
        <Field 
        name="category_id" 
        editable = { props.origin === 'edit' ? false : true }
        label="Categoria"
        data={props.categories} 
        component={ props.origin === 'edit' ?  fieldInputFloat : fieldSelectCategoriesPicker }
        />   
        <Field 
        name="brand" 
        label="Marca" 
        component={fieldInputFloat}
        />
        <Field 
        name="description" 
        textContentType="emailAddress"
        label="Descripción" 
        component={fieldInputFloat} 
        />
        <Field 
        name="money" 
        label="Moneda"
        initialValue={  props.initialValues ? props.initialValues.money : null }
        data={['Seleccione','COP', 'USD', 'EUR']} 
        component={fieldSelectPicker}
        />   
        <Field 
        name="price" 
        label="Precio" 
        keyboardType={'decimal-pad'}
        component={fieldInputFloat}
        />   
        <Field 
        name="unity" 
        label="Unidad"
        //initialValue={ props.initialValues ? props.initialValues.unity : null }
        data={['Seleccione','kg', 'g', 'L','ml', 'unid','N/A']} 
        component={fieldSelectPicker}
        />     
         <Field 
        name="quantity" 
        label="Cantidad" 
        ph="200"
        keyboardType={'decimal-pad'}
        component={fieldInputFloat}
        />    
        <View style={styles.button}>
            <ButtonRegister 
            title="Guardar" 
            click={  props.save }                           
            invalid={ props.invalid } 
            color="black"
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body:{
    alignItems:'center',
    marginHorizontal:20
  },
  button: {
      paddingTop:40,
      paddingBottom:20
  }
});

export default reduxForm({
  form: 'ProductForm',
  validate,
})(ProductForm);
