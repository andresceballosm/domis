import React from 'react';
import MapView from 'react-native-maps'

export const MapsComponent = (props) => {
    const latitude = props.latitude;
    const longitude = props.longitude;
    console.log('latitude que llega', longitude);
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.0009,
      longitudeDelta: 0.0009
    }
    return (
        <MapView
          style = {[{flex:1}, props.width && { width: props.width, height:props.height }]}
          region={region}
        >
          <MapView.Marker
            draggable={props.draggable}
            onDragEnd={(e) => props.newCoordinates(e.nativeEvent.coordinate)}
            title={props.storeName}
            coordinate={region} />
        </MapView>  
    );
}
  