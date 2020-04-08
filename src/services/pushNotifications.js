import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import LocalStorage from '../utils/localStorage';
import { dataBase, messaging } from '../services/Firebase';

const checkPermission = async (userUid, getTokensUser, tokenNotifications, deleteTokens) => {
  const enabled = await messaging.hasPermission();
  if(enabled){
    getToken(userUid, getTokensUser, tokenNotifications, deleteTokens);
  } else {
    requestPermission(userUid, getTokensUser, tokenNotifications, deleteTokens);
  }
}

const getToken = async ( userUid, getTokensUser, tokenNotifications, deleteTokens ) => {
  let fcmTokenLocal = await LocalStorage.get('fcmToken');
  let fcmToken = await messaging.getToken();
  console.log('fcmTokenLocal',fcmTokenLocal)
  if(!fcmTokenLocal) { 
    await validateExistTokenUser(userUid, tokenNotifications, getTokensUser, deleteTokens)
    await dataBase.collection('token_notifications').doc().set({token: fcmToken.toString(), user: userUid})
    await LocalStorage.set('fcmToken', fcmToken);
  } else {
    await getTokensUser(userUid)
    const dataTokens = tokenNotifications;
    console.log('dataTokens',dataTokens);
    if(dataTokens){
      tokenUser = dataTokens[0]._data.token;
      if( fcmToken !== tokenUser){
        await deleteTokenUser(fcmToken, deleteTokens);
        await saveTokenUser(fcmToken, userUid)
      } 
    } else {
      await deleteTokenUser(fcmToken, deleteTokens)
      await saveTokenUser(fcmToken, userUid)
    }
  }
} 

const saveTokenUser = async (fcmToken, userUid) => {
  await dataBase.collection('token_notifications').doc().set({token: fcmToken.toString(), user: userUid})
  await AsyncStorage.setItem('fcmToken', fcmToken);
} 

const validateExistTokenUser = async (userUid, tokenNotifications, getTokensUser, deleteTokens) => {
  await getTokensUser(userUid)
  const dataTokens = tokenNotifications;
  console.log('dataTokens',dataTokens);
  if(dataTokens){
    await deleteTokens(dataTokens)
  } 
} 
//Elimina el token del dispositivo de la base de datos
const deleteTokenUser = async (fcmToken, deleteTokens) => {
  const token = await dataBase.collection('token_notifications')
              .where("token", "==", fcmToken)
              .get()
              .then(data => data);
  if(token._docs.length > 0) {
      deleteTokens(token.docs)
  }
}

const requestPermission = async (userUid, getTokensUser, tokenNotifications, deleteTokens) => {
  try {
    await messaging.requestPermission();
    getToken(userUid, getTokensUser, tokenNotifications, deleteTokens);
  } catch (error) {
    console.log('permission rejected');
  }
}

//NEW
const addUserToNotifications = async (id, notificationToSave, user, newData) => {
  if(user.length > 0){
    user.notifications.push(notificationToSave)
    newData.push(user)
  } else {
    let dataSaved = {
      id,
      notifications : [
        notificationToSave
      ]
    }
    newData.push(dataSaved)
  }
  
  LocalStorage.set('notifications', JSON.stringify(newData))
};

const savedNotification = async (id, title, notificationId) => {
  const notificationToSave = {
    title,
    notificationId
  };

  LocalStorage.get('notifications').then( notificationsSaved => { 
    let newData = JSON.parse(notificationsSaved);
    if(newData) {
      let user = newData.filter( data => data.id == id);
      if(user[0].length === 0){
        addUserToNotifications(id, notificationToSave, user, newData)
      } else {
        let notificationsUser = user[0].notifications;
        notificationsUser.push(notificationToSave);
        LocalStorage.set('notifications', JSON.stringify(newData));
      }
    } else {
      object = [];
      newData = [];
      addUserToNotifications(id, notificationToSave, object, newData)
    }
  })
};


//Listener in background
const notificationOpenBackListener = async (navigation) => {
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    const { data } = notificationOpen.notification;
    switch (data.route) {
      case 'requestofteam':
        return navigation.navigate('RequestCaptainTeam')
      default:
        break;
    }
  }
};

//When clicked in notification
const notificationOpenedListener = async (navigation) =>
  firebase.notifications().onNotificationOpened( async (notificationOpen) =>  {
    let dataNotification = notificationOpen.notification;
    let notificationId = dataNotification.notificationId;
    console.log('navigation', navigation)
    // setTimeout(function(){
    //   switch (dataNotification._data.route) {
    //       case 'requestofteam':
    //         navigation.navigate('RequestCaptainTeam');
    //         break;
    //       case 'requestofgallery':
    //         navigation.navigate('Gallery');
    //         break;
    //       case 'requestofclubplayer':
    //         navigation.navigate('PlayersList')
    //         break;
    //     default:
    //       //navigation.navigate(dataNotification._data.route)
    //       navigation.navigate('home')
    //       break;
    //   }
    // },1000)

    if( notificationOpen.action === "android.intent.action.MAIN"){
      //Save notification for show in dashboard
      await savedNotification(
        dataNotification.data.id,  
        dataNotification.data.body,
        dataNotification._notificationId,
      );
    };

    //Delete notification
    firebase.notifications().removeDeliveredNotification(notificationId)
    setTimeout(function(){
      if(notificationOpen.notification._data.path){
        navigation.navigate(notificationOpen.notification._data.path, {
          origin : 'notification'
        })
      }
    },1000 )
});

const notificationListener = (setNotifications) => {
  firebase.notifications().onNotification( async (notification) => {
    const localNotification = new firebase.notifications.Notification({
      show_in_foreground: true,
    })
    .setNotificationId(notification.notificationId)
    .setTitle(notification.title)
    .setBody(notification.body)
    .setData(notification.data)
    .android.setChannelId('fcm_FirebaseNotifiction_default_channel')
    .android.setSmallIcon('ic_launcher') 
    .android.setPriority(firebase.notifications.Android.Priority.High)
    // firebase.notifications().displayNotification(notification);

    firebase.notifications()
    .displayNotification(localNotification)
    .catch(err => console.error(err));

    const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Indigo Payments', firebase.notifications.Android.Importance.High)
    firebase.notifications().android.createChannel(channel);
    //Save notification for show in dashboard
    await savedNotification(
      notification.data.id,  
      notification.data.body,
      notification._notificationId
    );
    setTimeout(function(){ setNotifications(notification._notificationId) }, 1000);
    
  });
}

const saveToken = async (props, userId) => {
  let fcmToken = await messaging.getToken();
  props.saveTokenPush(fcmToken,userId);
}


export {
  checkPermission,
  saveToken,
  notificationListener,
  notificationOpenBackListener,
  notificationOpenedListener
}