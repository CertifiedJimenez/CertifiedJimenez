/* Keyboard equivalents for the reference's pointer interactions. */
document.querySelectorAll('[role="button"]').forEach(function (control) {
  control.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      control.click();
    }
  });
  control.addEventListener('click', function () {
    control.setAttribute('aria-pressed', control.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });
});
