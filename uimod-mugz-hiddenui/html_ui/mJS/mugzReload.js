window.document.addEventListener("keyup", function (e) {
  if (e.keyCode == iKey || e.keyCode == mKey) {
    setTimeout(function() { 
      if (localStorage.getItem('iToggle') == 'false') {
        window.location.reload();
      }
    }, 50);
  }
});
