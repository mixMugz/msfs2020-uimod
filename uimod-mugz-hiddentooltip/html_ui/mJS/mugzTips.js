var tipsKey = 18;
window.document.addEventListener("keydown", function (e) {
  if (e.keyCode == tipsKey) {
    window.document.documentElement.style.setProperty('--tips-block', 'block');
  }
});
window.document.addEventListener("keyup", function (e) {
  if (e.keyCode == tipsKey) {
    window.document.documentElement.style.setProperty('--tips-block', 'none');
  }
});
