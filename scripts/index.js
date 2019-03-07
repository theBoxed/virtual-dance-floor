document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
      predictSekeleton.onPageLoad(); 
  }
}