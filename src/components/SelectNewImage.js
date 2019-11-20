import React from 'react';
import { View, Image, StyleSheet, Platform, Button } from 'react-native';
import  ImagePicker from 'react-native-image-crop-picker' ;

const SelectNewImage = (props) => {

  const selectImage = async () => {
    try {
      await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false
      }).then(image => {
        props.load(image)
      });
    } catch (e) {
      console.log(e);
    }
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  const openCamera = () => {
      const result = ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: false,
      })
  }
  return (
    <View style={{alignItems:'center'}}>
        { props.image ? (
            <Image source={{ uri: props.image.path }} 
            style={styles.image} 
        />
        ):(
        <Image source={{ uri: props.urlImage }} 
            style={styles.image} 
            />
        )}
        <View style={{ paddingTop:20}}>
            <Button
                title={props.titleBtn ? props.titleBtn : 'Subir'}
                buttonStyle={{borderRadius: 180, backgroundColor:'#78b3a3', width:100}}
                onPress={()=>{ selectImage() }}
            /> 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100, 
    height: 100,
    borderRadius:10,
    alignItems:'center'
  }
});
export default SelectNewImage;

