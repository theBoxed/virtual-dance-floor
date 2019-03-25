const manageUsers = () => { 
  const currUsers = {}; 
  const checkForUpdates = () => { 
    let timeToInvoke = 3000; 
    //reads users from fire base every x milliseconds
    const intervalVar  = setInterval(_checkUserList, timeToInvoke);     
  }

  const _checkUserList = () => { 
    firebase
      .database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        //number of firebase participants
        const numFBParticipants = (Object.keys(snapshot.val()).length -1); 
        _printNumParticipants(numFBParticipants); 
        _areParticipantsLengthEqual(numFBParticipants, participants.length, snapshot.val()); 
      });  
  }

  const _printNumParticipants = (FBParticipants) => { 
    console.log('num firebase-participants:', FBParticipants, 
      'num local-participants:', participants.length); 
  }

  const _areParticipantsLengthEqual = (fbPrtcpntsLength, locPrtcpntsLength, fbParticipants) => { 
    if (fbPrtcpntsLength !== locPrtcpntsLength){ 
      // alert("the number of user's have changed"); 
      console.log("the number of user's has changed"); 
      _numUsersHasChanged(fbPrtcpntsLength, locPrtcpntsLength, fbParticipants); 
    }
  }

  const _numUsersHasChanged = (fbPrtcpntsLength, locPrtcpntsLength, fbParticipants) => { 
    //if a key is in snapshot but not participants
    if (fbPrtcpntsLength > locPrtcpntsLength){ 
      _addUser(fbParticipants); 
    }

    //if a key is in participants but not snapshot
    else if (fbPrtcpntsLength < locPrtcpntsLength){ 
      _removeUser(fbParticipants); 
    }
  }

  const _loopThroughUsers = () => { 
    for (let prop in users) { 

    }
  }

  const _addUser = () => { 
    console.log('adding user'); 
    //add user to array of participants
  }
  
  const _removeUser = () => { 
    console.log('removing users'); 
    //remove user from array of participants
  }

  return { checkForUpdates }
}