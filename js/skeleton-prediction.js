const config = {
  apiKey: 'AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag',
  authDomain: 'virtual-dance-floor.firebaseapp.com',
  databaseURL: 'https://virtual-dance-floor.firebaseio.com',
  projectId: 'virtual-dance-floor',
  storageBucket: 'virtual-dance-floor.appspot.com',
  messagingSenderId: '542923101372'
};

let dancer;
const userId = Math.floor(Math.random() * 40000);

//Sets up the canvas and initializes the video.
function setup() {
  firebase.initializeApp(config);

  //Create the intialize obj in fb
  firebase.database().ref();
  //Create obj within world to hold all users
  firebase
    .database()
    .ref()
    .child('users')
    .push().key;
  //Setup the canvas
  createCanvas(800, 600);
  background(0);
  //call method to setup video and ml5
  Draw.begin();
  dancer = new Dancer();
}

function writeUserData(joints) {
  firebase
    .database()
    .ref(`users/userId:${userId}`)
    .set({ joints });
}

function loopThroughUsers(users) {
  console.log('user', users);
  for (prop in users) {
    //if you're not yourself don't redraw
    if (prop !== `userId:${userId}`) {
      continue;
    }
   
    if(users[prop].joints !== null){

      console.log('users - props', users[prop].joints)
      Draw.drawPose(users[prop].joints, {color: [100]})
    }

    //   console.log('hello', users[prop])
    // Draw.drawPose(users[prop].joints, { color: dancer.data.color });
  }
}

function draw() {
  background(0);
  //update the skeleton
  dancer.update(Draw.getPose());
  //draw the skeleton
  if (dancer.data.pose != null) {
    writeUserData(dancer.data.pose);
    Draw.drawPose(dancer.data.pose, { color: dancer.data.color });
  }
  //provides firebase with dancer updates
  writeUserData(dancer.data.pose);


  firebase
    .database()
    .ref(`users/`)
    .once('value')
    .then(function(snapshot) {
      loopThroughUsers(snapshot.val());
    });
}
