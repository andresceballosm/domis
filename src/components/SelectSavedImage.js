import React from 'react';
import { View, Image, StyleSheet,Platform, Button } from 'react-native';
import  ImagePicker  from  'react-native-image-crop-picker' ;
import { LoadingSmall } from './LoadingSmall';
import SelectNewImage from './SelectNewImage';

const SelectSavedImage = (props) => {

    const selectImage = async () => {
        try {
        await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: false
        }).then(image => {
            props.load(image,/*props.uid*/)
        });
        } catch (e) {
        console.log(e);
        }
    }   
  return (
    <View>
        { props.urlImage ? (
            <SelectNewImage 
            image={props.image}
            load={props.load} 
            urlImage={props.urlImage}
            uid={props.uid}
            setting={props.setting}
            />
        ):(
            <View style={{alignItems:'center'}}>  
                { props.image ? (
                    <Image loadingIndicatorSource={() => <LoadingSmall />} source={{ uri: props.image.path }} 
                    style={styles.image} 
                />
                ):(
                    <View style={{ alignItems:'center'}}>
                        <Image source={require('../../assets/icons/basket-100.png')} 
                        style={styles.image} />
                    </View>
                )}      
                <View style={{paddingTop:20}}>
                    <Button
                        title={props.titleBtn ? props.titleBtn : 'Subire'}
                        style={{borderRadius: 180, backgroundColor:'#78b3a3', width:100}}
                        onPress={()=>{ selectImage() }}
                    /> 
                </View>
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100, 
    height: 100,
    borderRadius:10,
  }
});
export default SelectSavedImage;

