const manageUsers = () => { 
  const checkForUpdates = () => { 
    let timeToInvoke = 3000; 
    const intervalVar  = setInterval(_checkUserList, timeToInvoke);     
  }

  const _checkUserList = () => { 
    console.log('checkUserList'); 
  }

  return { checkForUpdates }
}