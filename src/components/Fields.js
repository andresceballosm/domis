
import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Dimensions, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ModalSelector from 'react-native-modal-selector';
import { Item, Input, Label, Picker, Icon } from 'native-base';
import Moment from 'moment';

let screenWidth = Dimensions.get('window').width;

export const fieldInput = (props) => {
    return (
      <View style={styles.texInput}>
        <View style={styles.startRow}>
            <Text style={styles.inputNameText}>{props.label}</Text>  
        </View>
        <View style={styles.endRow}>
          <View style={[styles.field, props.multiline ? { height : 70 } : { height : 45}]}>
            <TextInput
              placeholder={props.ph}
              style={{fontSize:18, marginLeft: 10, marginRight:10}}
              editable={props.editable}
              multiline={props.multiline}
              keyboardType={props.keyboardType}
              onChangeText={props.input.onChange}
              textContentType={props.textContentType}
              value={`${props.input.value}`}
              secureTextEntry={props.password}
              onBlur={props.input.onBlur}
            />
          </View>
          <View style={styles.linea} />
        {props.meta.touched &&
          props.meta.error && <Text style={styles.errors}>{props.meta.error}</Text>}
        </View>
      </View>
    );
};


export const fieldInputFloat = (props) => {
  return (
    <View style={styles.texInput}>
        <Item floatingLabel>
            <Label>{props.label}</Label>
            <Input 
            placeholder={props.ph}
            editable={props.editable}
            keyboardType={props.keyboardType}
            onChangeText={props.input.onChange}
            textContentType={props.textContentType}
            secureTextEntry={props.password}
            value={`${props.input.value}`}
            onBlur={props.input.onBlur}
            />
            { props.meta.touched && props.meta.error ?  
              <Text style={styles.errors}>{ props.meta.error }</Text> : <View />
            }
        </Item>
        {props.meta.touched && props.meta.error ?
        <Item>
          <Icon style={{color : '#b8444a'}} name='close-circle' />
        </Item> : <View />
        }
    </View>
  );
};

export const InputFloat = (props) => {
  return (
    <View style={styles.texInput}>
        <Item floatingLabel>
            <Label style={props.style}>{props.label}</Label>
            <Input 
            style={props.style}
            placeholder={props.ph}
            editable={props.editable}
            keyboardType={props.keyboardType}
            onChangeText={ (value) => props.onChange(value)}
            textContentType={props.textContentType}
            secureTextEntry={props.password}
            // value={`${props.input.value}`}
            // onBlur={props.input.onBlur}
            />
        </Item>
    </View>
  );
};

export const fieldSelectPicker = (props) => {
  return (
    <View style={styles.selectInput}>
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: scaleToDimension(300)}}
          iosHeader="Seleccione"
          placeholderStyle={ props.initialValue ? { color: "black" } : { color: "gray" } }
          placeholder={ props.initialValue ? props.initialValue : props.label}
          headerBackButtonText="Salir"
          placeholderIconColor="#007aff"
          selectedValue={props.input.value}
          onValueChange={props.input.onChange}
        >
          { props.data.map((value, idx) => { 
              return (
                  <Picker.Item label={value} key={idx} label={value} value={value} />
              )
          })}
        </Picker>
      </Item>
    </View>
  ) 
}

export const SelectPicker = (props) => {
  return (
    <View style={styles.selectInput}>
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: scaleToDimension(300)}}
          iosHeader="Seleccione"
          placeholderStyle={ props.initialValue ? { color: "black" } : { color: "gray" } }
          placeholder={ props.initialValue ? props.initialValue : 'Seleccione'}
          headerBackButtonText="Salir"
          placeholderIconColor="#007aff"

          selectedValue={props.initialValue ? props.initialValue  : '' }
          onChange={ ( value ) => props.change(value) } 
        >
          { props.data.map((value, idx) => { 
              return (
                  <Picker.Item label={value} key={idx} label={value} value={value} />
              )
          })}
        </Picker>
      </Item>
    </View>
  ) 
}



export const fieldSelectCategoriesPicker = (props) => {
  return (
    <View style={styles.selectInput}>
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: scaleToDimension(300) }}
          placeholderStyle={{ color: "gray", alignItems:'flex-start' }}
          iosHeader="Seleccione"
          placeholder={props.label}
          headerBackButtonText="Salir"
          placeholderIconColor="#007aff"
          onBlur={ (value) => console.log('blur', value)}
          selectedValue={ props.input.value}
          onValueChange={ props.input.onChange }
        >
          { props.data.map((value, idx) => { 
              return (
                  <Picker.Item key={idx} label={value.name} value={value.id} />
              )
          })}
        </Picker>
      </Item>
    </View>
  ) 
}

export const fieldSelectCategories = (props) => {
  return (
    <View style={styles.texInput}>
      <View style={styles.startRow}>
          <Text style={styles.inputNameText}>{props.label}</Text>  
      </View>
      <View style={styles.endRow}>
        <View style={styles.field}>
          <ModalSelector
          data={props.data}
          labelExtractor= { item => item.name}
          initValue={ props.initialValue }
          cancelButtonAccessibilityLabel='Cancelar'
          style={{ fontSize:16, height:45, color:'black', borderWidth:0}}
          onChange={(category)=>{
            props.input.onChange(category.id)
          }}
          selectStyle={{ borderWidth:0}}
          />
        </View>
      </View>
    </View>
  );
};


export const fieldInputOrder = (props) => {
  return (
    <View>
      <Text style={{fontSize:16, fontFamily:'Ubuntu-Bold'}}>{props.label}:</Text>
      <TextInput
          style={{height: 40, borderBottomWidth:.5}}
          editable={props.editable}
          placeholder={props.placeholder}
          onBlur={props.input.onBlur}
          onChangeText={props.input.onChange}
          keyboardType = {props.keyboardType}
          value={props.input.value}
      />
      <View style={styles.linea} />
      {props.meta.touched &&
        props.meta.error && <Text style={styles.errors}>{props.meta.error}</Text>}
    </View>
  );
};

export const fieldInputNumber = (props) => {
  return (
    <View>
      <Text style={{fontSize:16, fontFamily:'Ubuntu-Bold'}}>{props.label}:</Text>
      <TextInput
          style={{height: 40, borderBottomWidth:.5}}
          editable={props.editable}
          placeholder={props.placeholder}
          onBlur={props.input.onBlur}
          onChangeText={(value) => props.input.onChange(value.replace(/[^0-9]/g, ''))}
          keyboardType = {props.keyboardType}
          value={props.input.value}
      />
      { props.meta.touched && props.meta.error ?  
        <Text style={styles.errors}>{ props.meta.error }</Text> : <View />
      }
    </View>
  );
};

export const FieldSelect = (props) => {
  return(
    <View style={{flex:1}}>
        <ModalSelector
        data={ props.data }
        disabled={props.editable}
        labelExtractor= { item => item.address }
        initValue={ props.initialValue ? props.initialValue.address : '' }
        cancelButtonAccessibilityLabel='Cancelar'
        onChange={ ( value ) => props.change(value) } 
        />
    </View>
  )

}

export const FieldDate = (props) => {
  const _handlePicker = (date) => {
    Moment.locale('en');
    const newdate =  Moment(date).format('l')
    props.action(newdate)
    _hideDatePicker();
  };
  const _hideDatePicker = () => {
    console.log('')
    props.isVisible(false);
  };

  return (
      <View style={styles.texInput}>
        <View style={styles.startRow}>
            <Text style={styles.inputNameText}>{props.label}</Text>  
        </View>
        <View style={styles.endRow}>       
          <View style={styles.field}>
            <View style={{flex:1, flexDirection:'row', marginTop:5}}>
                <TouchableOpacity
                onPress={()=> { 
                  if(props.editable !== undefined){
                    if(props.editable){
                      props.isVisible(true)
                    }
                    return;
                  } else {
                    props.isVisible(true)
                  }
                }} 
                style={{flex:1, marginLeft:10, paddingBottom:5}}>
                  <Image style={{width:20, height:20}}
                  source={require('../../assets/icons/calendar.png')} />      
                </TouchableOpacity>
                <View style={{flex:2}}>
                  <Text>{props.value}</Text>
                </View>
            </View>
            <DateTimePicker
              minimumDate={props.minDate}
              disabled={props.editable}
              isVisible={props.visible ? true:false}
              onConfirm={(date) => _handlePicker(date)}
              onCancel={_hideDatePicker}
              mode="date"
            />
          </View>
        </View>
      </View>
  );
};

const scaleToDimension = (size) => {
  return screenWidth * size / 375
};

const styles = StyleSheet.create({
    texInput: {
        flexDirection: 'row',
        alignItems:'center',
        marginHorizontal: 10,
        marginVertical:10,
        width: scaleToDimension(300)
    },
    selectInput : {
      flexDirection: 'row',
      alignItems:'center',
      marginVertical:10,
      width: scaleToDimension(300)
    },
    startRow:{
        flex: 1,
        paddingBottom:Platform.OS === 'ios' ? 10 : 0,
        paddingTop:Platform.OS === 'ios' ? 0 : 10,
        justifyContent: 'center',
    },
    inputNameText:{
        textAlign: 'right', 
        alignSelf: 'stretch',
    }, 
    endRow:{
        flex:2, 
        marginLeft: 10,
        justifyContent:'center'
    }, 
    field:{
        flex:1,
        backgroundColor: 'rgba(58, 58, 58, 0.2)',
        height: 45,
        borderRadius:12,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
              padding: 10,
              shadowColor: '#e8e6e6',
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowRadius: 5,
              shadowOpacity: 1.0
            },
            android: {
              elevation: 0,
            }
        })

    },
    linea: {
        height: 12,
        flex:1
    },
    errors: {
        color: '#FF0000',
    },
})