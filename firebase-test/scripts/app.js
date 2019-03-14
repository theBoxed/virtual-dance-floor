var config = {
  apiKey: "AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag",
  authDomain: "virtual-dance-floor.firebaseapp.com",
  databaseURL: "https://virtual-dance-floor.firebaseio.com",
  projectId: "virtual-dance-floor",
  storageBucket: "virtual-dance-floor.appspot.com",
  messagingSenderId: "542923101372"
};
firebase.initializeApp(config);

let  VIRTUAL_DANCE_FLOOR = firebase.database().ref(); 
console.log('database', VIRTUAL_DANCE_FLOOR); 


function writeUserData(x, y, userId) {
  console.log('userdata', x, y, userId); 
  firebase.database().ref().set({
    userId, userId, 
    x: x,
    y: y,
  });
}
console.log('database', VIRTUAL_DANCE_FLOOR); 
