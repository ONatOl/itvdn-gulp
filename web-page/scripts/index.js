window.onload=function() {
  const serarchButton = document.querySelectorAll('.search');

  const closeBtn = document.querySelectorAll('.close');
  const overlayElement = document.getElementsByClassName('overlay');
  /**
 * Hide overlay.
 */
  function hideOverlay() {
    overlayElement[0].classList.add('hide');
  }
  serarchButton[0].addEventListener('click', function(e) {
    if (overlayElement[0].className === 'overlay hide') {
      overlayElement[0].classList.remove('hide');
    }
  });

  overlayElement[0].addEventListener('click', function(e) {
    if (e.target.className === 'overlay') {
      hideOverlay();
    }
  });
  closeBtn[0].addEventListener('click', function() {
    hideOverlay();
  });
  const wrapperElements = document.querySelectorAll( '.wrapper' );
  const offSetLeftPosition = wrapperElements[0].offsetLeft;
  const value = `${offSetLeftPosition+100}px`;
  document.documentElement.style.setProperty(
      '--size', value,
  );
};
