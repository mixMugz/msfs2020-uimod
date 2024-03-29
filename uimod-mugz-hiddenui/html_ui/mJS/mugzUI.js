var hKey = 144; // Hud toggle. NumLock keybind.
var iKey = 123; // Ingame Markers (POI/Nameplates) toggle. F12 keybind.
var mKey = 8;   // Main (all items) toggle. Backspace keybind.

if (mugzInit === null) {
  var page = document.getElementById('youriframe');
  var mugzInit = true;
}

if (localStorage.getItem('hToggle') === null) localStorage.setItem('hToggle', 'true');
if (localStorage.getItem('iToggle') === null) localStorage.setItem('iToggle', 'true');
if (localStorage.getItem('mToggle') === null) localStorage.setItem('mToggle', 'true');

window.document.documentElement.style.setProperty('--hud-vis', (localStorage.getItem('hToggle') == 'true') ? 'visible' : 'hidden');
window.document.documentElement.style.setProperty('--igm-vis', (localStorage.getItem('iToggle') == 'true') ? 'visible' : 'hidden');

window.document.addEventListener("keyup", function (e) {
  if (e.keyCode == hKey) {
    setTimeout(function() {
      window.document.documentElement.style.setProperty('--hud-vis', (localStorage.getItem('hToggle') == 'true') ? 'visible' : 'hidden');
    }, 50);
  }
  else if (e.keyCode == iKey) {
    setTimeout(function() {
      window.document.documentElement.style.setProperty('--igm-vis', (localStorage.getItem('iToggle') == 'true') ? 'visible' : 'hidden');
    }, 50);
  }
  else if (e.keyCode == mKey) {
    setTimeout(function() {
      window.document.documentElement.style.setProperty('--hud-vis', (localStorage.getItem('hToggle') == 'true') ? 'visible' : 'hidden');
      window.document.documentElement.style.setProperty('--igm-vis', (localStorage.getItem('iToggle') == 'true') ? 'visible' : 'hidden');
    }, 50);
  }
});

// Toggler functions for Toolbar
function hToggler() {
  localStorage.setItem('hToggle', (localStorage.getItem('hToggle') == 'true') ? 'false' : 'true');
};

function iToggler() {
  localStorage.setItem('iToggle', (localStorage.getItem('iToggle') == 'true') ? 'false' : 'true');
};

function mToggler() {
  localStorage.setItem('mToggle', (localStorage.getItem('mToggle') == 'true') ? 'false' : 'true');
  localStorage.setItem('hToggle', localStorage.getItem('mToggle'));
  localStorage.setItem('iToggle', localStorage.getItem('mToggle'));
};
