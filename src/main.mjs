import { draw } from './draw.mjs';
import { loadWalls, saveWalls, setSize } from './util.mjs';

window.onload = () => {
  loadWalls();

  document.onvisibilitychange = () => {
    if (document.visibilityState === 'hidden') {
      saveWalls();
    }
  };

  document.querySelectorAll('form').forEach((form) => {
    form.onsubmit = (e) => e.preventDefault();

    form.querySelectorAll('input').forEach((input) => {
      input.onchange = () => {
        setSize(form);
        draw();
      };
    });

    setSize(form);
  });

  draw();
};
