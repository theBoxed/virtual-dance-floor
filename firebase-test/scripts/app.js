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

VIRTUAL_DANCE_FLOOR.on("value", snapshot => { 
  console.log('snapshot', snapshot.val()); 
}); 


console.log('database', VIRTUAL_DANCE_FLOOR); 
