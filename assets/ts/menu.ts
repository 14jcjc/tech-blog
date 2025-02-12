/**
 * Slide up/down
 * Code from https://dev.to/bmsvieira/vanilla-js-slidedown-up-4dkn
 * @param target 
 * @param duration 
 */
/**
 * Slide up/down animation
 * @param target 
 * @param duration 
 */
let slideUp = (target: HTMLElement, duration = 500) => {
  if (target.classList.contains('transiting')) return;
  target.classList.add('transiting');
  
  target.style.height = `${target.offsetHeight}px`;
  target.offsetHeight; // Reflow
  target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
  target.style.overflow = 'hidden';
  target.style.height = '0';
  target.style.paddingTop = '0';
  target.style.paddingBottom = '0';
  target.style.marginTop = '0';
  target.style.marginBottom = '0';

  window.setTimeout(() => {
      target.classList.remove('show');
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition');
      target.classList.remove('transiting');
  }, duration);
};

let slideDown = (target: HTMLElement, duration = 500) => {
  if (target.classList.contains('transiting')) return;
  target.classList.add('transiting');
  
  target.classList.add('show');
  target.style.display = 'block';

  let height = target.offsetHeight;
  target.style.height = '0';
  target.style.paddingTop = '0';
  target.style.paddingBottom = '0';
  target.style.marginTop = '0';
  target.style.marginBottom = '0';
  target.offsetHeight; // Reflow

  target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
  target.style.height = `${height}px`;
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');

  window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition');
      target.classList.remove('transiting');
  }, duration);
};

let slideToggle = (target: HTMLElement, duration = 500) => {
  if (target.classList.contains('show')) {
      slideUp(target, duration);
  } else {
      slideDown(target, duration);
  }
};

export default function () {
  const toggleMenu = document.getElementById('toggle-menu');
  const mainMenu = document.getElementById('main-menu');

  if (toggleMenu && mainMenu) {
      toggleMenu.addEventListener('click', () => {
          if (mainMenu.classList.contains('transiting')) return;
          document.body.classList.toggle('show-menu');
          slideToggle(mainMenu, 300);
          toggleMenu.classList.toggle('is-active');
      });
  }
}
