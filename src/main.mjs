import { draw } from './draw.mjs';
import { loadWalls, saveWalls, setSize, startDragging } from './util.mjs';

window.onload = () => {
  loadWalls();

  document.onvisibilitychange = () => {
    if (document.visibilityState === 'hidden') {
      saveWalls();
    }
  };

  window.addEventListener('mousedown', (e) => {
    /** @type {HTMLElement} */
    const target = e.target;
    if (target.classList.contains('tile')) {
      startDragging({ target, offsetX: e.pageX });
    }
  });

  document.querySelectorAll('form').forEach((form) => {
    form.onsubmit = (e) => e.preventDefault();

    const walls = document.getElementById('walls');
    form.querySelectorAll('input').forEach((input) => {
      if (input.type === 'color') {
        const setColor = () => walls.style.setProperty('--gap-color', input.value);
        input.onchange = setColor;

        /** @type {HTMLSelectElement} */
        const select = input.nextElementSibling;
        select.onchange = () => {
          input.value = select.value;
          setColor();
        };
      } else {
        input.onchange = () => {
          setSize(form);
          draw();
        };
      }
    });

    setSize(form);
  });

  draw();
};
