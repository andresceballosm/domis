import React from 'react';
import { View } from 'react-native'
import MapView from 'react-native-maps'

// const getLocation = async () => {
//     return await new Promise(
//         (resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(
//                 (data) => resolve(data.coords),
//                 (err) => reject(err)
//             );
//         }
//     );
// }

export const MapsComponent = (props) => {
    const latitude = props.latitude;
    const longitude = props.longitude;
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }
    return (
        <MapView
          style = {{ flex:1 }}
          region={region}
        >
          <MapView.Marker
            title={props.storeName}
            coordinate={region} />
        </MapView>  
    );
}
  