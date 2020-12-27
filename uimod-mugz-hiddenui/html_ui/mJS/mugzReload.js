window.document.addEventListener("keyup", function (e) {
  if (e.keyCode == iKey || e.keyCode == mKey) {
    setTimeout(function() { 
      if (localStorage.getItem('iToggle') == 'false') {
        document.location.reload();
      }
    }, 50);
  }
});
