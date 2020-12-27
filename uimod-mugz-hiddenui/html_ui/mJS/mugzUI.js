var hKey = 144; // Hud toggle. NumLock keybind.
var iKey = 123; // Ingame Markers (POI/Nameplates) toggle. F12 keybind.
var mKey = 8;   // Main (all items) toggle. Backspace keybind.

if (localStorage.getItem('hToggle') === null) localStorage.setItem('hToggle', 'true');
if (localStorage.getItem('iToggle') === null) localStorage.setItem('iToggle', 'true');
if (localStorage.getItem('mToggle') === null) localStorage.setItem('mToggle', 'true');

window.document.documentElement.style.setProperty('--hud-block', (localStorage.getItem('hToggle') == 'true') ? 'block' : 'none');
window.document.documentElement.style.setProperty('--igm-block', (localStorage.getItem('iToggle') == 'true') ? 'block' : 'none');
window.document.documentElement.style.setProperty('--igm-flex', (localStorage.getItem('iToggle') == 'true') ? 'flex' : 'none');

window.document.addEventListener("keyup", function (e) {
  if (e.keyCode == hKey) {
    setTimeout(function() { 
      window.document.documentElement.style.setProperty('--hud-block', (localStorage.getItem('hToggle') == 'true') ? 'block' : 'none');
    }, 50);
  }
  else if (e.keyCode == iKey) {
    setTimeout(function() { 
      window.document.documentElement.style.setProperty('--igm-block', (localStorage.getItem('iToggle') == 'true') ? 'block' : 'none');
      window.document.documentElement.style.setProperty('--igm-flex', (localStorage.getItem('iToggle') == 'true') ? 'flex' : 'none');
    }, 50);
  }
  else if (e.keyCode == mKey) {
    setTimeout(function() { 
      window.document.documentElement.style.setProperty('--hud-block', (localStorage.getItem('hToggle') == 'true') ? 'block' : 'none');
      window.document.documentElement.style.setProperty('--igm-block', (localStorage.getItem('iToggle') == 'true') ? 'block' : 'none');
      window.document.documentElement.style.setProperty('--igm-flex', (localStorage.getItem('iToggle') == 'true') ? 'flex' : 'none');
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
