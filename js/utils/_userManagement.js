const manageUsers = () => { 
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
        const numUsers = Object.keys(snapshot.val()).length; 
        if ((numUsers - 1) !== participants){ 
          alert("the number of user's have changed"); 
          _numUsersHasChanged(snapshot.val()); 
        }
      });  
  }

  const _numUsersHasChanged = (users) => { 
    //if a key is in snapshot but not participants
    if (users.length > participants){ 
      _addUser(); 
    }

    //if a key is in participants but not snapshot
    else if (users.length < participants){ 
      _removeUser(); 
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