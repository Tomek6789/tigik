import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { HttpsError } from "firebase-functions/v1/auth";

initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const checkRoomExists = functions.https.onCall(async (data, context) => {

    const roomUid = data.roomUid;
    const room = await admin.database().ref(`rooms/${roomUid}`).get()
    
    console.log('OPONENTUID', room.exists())

    // .then((value) => {
    //   console.log(value)
    // }); 
    
    // .update({ dupa: true })  
    if(room.exists()) {
      return  'ok'
    } else {
      throw new HttpsError('not-found', 'room not exists please create room')

    }
})
