var config = {
  apiKey: "AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag",
  authDomain: "virtual-dance-floor.firebaseapp.com",
  databaseURL: "https://virtual-dance-floor.firebaseio.com",
  projectId: "virtual-dance-floor",
  storageBucket: "virtual-dance-floor.appspot.com",
  messagingSenderId: "542923101372"
};
firebase.initializeApp(config);
let userId = Math.floor(Math.random() * 40000); 
let VIRTUAL_DANCE_FLOOR = firebase.database().ref(); 
let person = VIRTUAL_DANCE_FLOOR.child(userId).push().key;

function writeUserData(x, y, userId) {
  firebase.database().ref(userId).set({
    x: x,
    y: y,
  });
}


