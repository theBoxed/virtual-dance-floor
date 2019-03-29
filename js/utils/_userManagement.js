/*global manageUsers*/
const manageUsers = () => { 

  const checkForUpdates = () => { 
		if (dancer.isReady){ 
			let timeToInvoke = 3000 
      //reads users from fire base every x milliseconds
      setInterval(_checkUserList, timeToInvoke)  
    }   
	}

	const _checkUserList = () => { 
		firebase
			.database()
			.ref("users")
			.once("value")
			.then(snapshot => {
				//number of firebase participants
				const numFBParticipants = (Object.keys(snapshot.val()).length -1) 
        // _printNumParticipants(numFBParticipants); 
        _areParticipantsLengthEqual(numFBParticipants, participants.length, snapshot.val()) 
      })  
  }

	const _printNumParticipants = (FBParticipants) => { 
		console.log("num firebase-participants:", FBParticipants, 
			"num local-participants:", participants.length) 
  }

	const _areParticipantsLengthEqual = (fbPrtcpntsLength, locPrtcpntsLength, fbParticipants) => { 
		if (fbPrtcpntsLength !== locPrtcpntsLength) { 
			console.log("the number of user's has changed") 
      _numUsersHasChanged(fbPrtcpntsLength, locPrtcpntsLength, fbParticipants) 
    }
	}

	const _numUsersHasChanged = (fbPrtcpntsLength, locPrtcpntsLength, fbParticipants) => { 
		//if a key is in snapshot but not participants
		const fbParticipantsKeys = Object.keys(fbParticipants) 
    if (fbPrtcpntsLength > locPrtcpntsLength){ 
			for (let i = 0; i < fbPrtcpntsLength; i++){ 

				console.log("participants", participants) 
        console.log("fbParticipants", fbParticipantsKeys[i], "participants", participants,  participants[i]) 

        if (fbParticipantsKeys[i] !== participants[i]){ 
					let newPartcipant = Participant() 
          firebase.database().ref(`users/${this.id}`) 
						.once("value")
						.then(snapshot => {
							newPartcipant.id = fbParticipantsKeys[i] 
              newParticipant.pose = snapshot.val().pose
              participants.push(newPartcipant) 
              return; 
						})  
        }
			}
		}

		//if a key is in participants but not snapshot
		else if (fbPrtcpntsLength < locPrtcpntsLength){ 
			for (let i = 0; i < locPrtcpntsLength; i++){ 
				if (fbParticipantsKeys[i] !== participants[i]){ 
					console.log("removing") 
          participants.splice(i, 1) 
          return; 
				}
			}
		}
	}

	return { checkForUpdates }
}