var config = {
  apiKey: "AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag",
  authDomain: "virtual-dance-floor.firebaseapp.com",
  databaseURL: "https://virtual-dance-floor.firebaseio.com",
  projectId: "virtual-dance-floor",
  storageBucket: "virtual-dance-floor.appspot.com",
  messagingSenderId: "542923101372"
};

// firebase.initializeApp(config);
// let userId = Math.floor(Math.random() * 40000); 
// let VIRTUAL_DANCE_FLOOR = firebase.database().ref(); 
// let users = VIRTUAL_DANCE_FLOOR.child('users').push().key; 

// function writeUserData(joints) {
//   firebase.database().ref(`users/userId:${userId}`).set({joints});
// }

// var usersRef = firebase.database().ref('users/');
// usersRef.on('value', function(snapshot) {
//   loopThroughUsers(snapshot.val()); 
// });

// function loopThroughUsers(users){ 
//   // console.log('users', users); 

//   for (prop in users){ 
//     // console.log('users', users[prop].joints); 

//     if (prop !== `userId:${userId}`){ 
//       Draw.drawPose(users[prop].joints, { color: local.data.color });
//     }
//   }
// }
