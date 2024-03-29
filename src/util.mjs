/**
 * @typedef Size
 * @property {number} width
 * @property {number} height
 */

import { updateLabel } from './draw.mjs';

/**
 * @typedef {Size & {offset: number, delta: number[]}} WallDef
 */

/**
 * @type {Size}
 */
export const tileSize = {
  width: 0,
  height: 0,
};

/**
 * @param {Element} parent
 * @param {Object} def
 * @param {string=} def.tagName
 * @param {string} def.className
 */
export const appendChild = (parent, { tagName = 'div', className }) =>
  parent.appendChild(Object.assign(document.createElement(tagName), { className }));

/**
 * @param {Element} node
 * @param {string} name
 * @returns {NodeListOf<HTMLInputElement>}
 */
export const findInputs = (node, name) =>
  node.querySelectorAll(`input[name=${name}]`);

/**
 * @param {HTMLFormElement} form
 */
export const setSize = (form) => {
  const formData = new FormData(form);

  const w = Number(formData.get('w')) * 10;
  const h = Number(formData.get('h')) * 10;

  /** @type {HTMLDivElement} */
  const wall = form.parentElement.querySelector('div.wall');
  if (wall) {
    wall.style.setProperty('--width', `${w}px`);
    wall.style.setProperty('--height', `${h}px`);
    wall.style.setProperty('--rowShift', String(formData.get('o')));

    wall.dataset['deltas'] = formData.getAll('d').join(',');
  } else {
    document.body.style.setProperty('--gap', `${Number(formData.get('gap')) * 10}px`);
    document.body.style.setProperty('--tileW', `${w}px`);
    document.body.style.setProperty('--tileH', `${h}px`);

    tileSize.width = w;
    tileSize.height = h;
  }
};

export const loadWalls = () => {
  /**
   * @type {Array<WallDef>}
   */
  let wallDefs = [];

  try {
    wallDefs = JSON.parse(localStorage.getItem('walls'));
  } catch (error) {
    console.error('localstorage');
  }

  wallDefs ||= [
    { width: 39, height: 92, offset: 2, delta: [0] },
    { width: 54, height: 92, offset: 2, delta: [0] },
    { width: 39, height: 92, offset: 2, delta: [0] },
  ];

  /** @type {HTMLTemplateElement} */
  const t_wall = document.querySelector('#t_wall');
  /** @type {HTMLTemplateElement} */
  const t_delta = document.querySelector('#t_delta');

  document.querySelector('#walls').append(
    ...wallDefs.map((def) => {
      /** @type {Element} */
      const clone = t_wall.content.cloneNode(true);

      clone.querySelector('.deltas').replaceChildren(
        ...new Array(4).fill(0).map(() => t_delta.content.cloneNode(true)));

      syncDeltas(clone, def.offset);

      Object.entries(def).forEach(([key, val]) => {
        const inputs = findInputs(clone, key.charAt(0));
        if (inputs.length) {
          if (Array.isArray(val)) {
            inputs.forEach((node, i) => (node.value = String(val[i])));
          } else {
            inputs[0].value = String(val);
          }
        }
      });
      return clone;
    }));
};

/**
 * @param {Element} wall
 * @param {number} offset
 */
export const syncDeltas = (wall, offset) => {
  wall.querySelectorAll('.deltas label').forEach((delta, idx) => {
    delta.classList.toggle('hidden', idx >= offset);
  });
};

export const saveWalls = () => {
  /** @type {Array<WallDef>} */
  let wallDefs = [];

  document.querySelectorAll('#walls > .wall')
    .forEach((node) => {
      wallDefs.push({
        width: findInputs(node, 'w')[0].valueAsNumber,
        height: findInputs(node, 'h')[0].valueAsNumber,
        offset: findInputs(node, 'o')[0].valueAsNumber,
        delta: [...findInputs(node, 'd')].map((n) => n.valueAsNumber),
      });
    });

  try {
    localStorage.setItem('walls', JSON.stringify(wallDefs));
  } catch (error) {
    console.error('localstorage');
  }
};

/**
 * @param {Object} props
 * @param {HTMLElement} props.target
 * @param {number=} props.offsetX
 * @param {string=} props.className
 */
export const startDragging = ({ target, offsetX = 0, className = 'dragging' }) => {
  const row = target.parentElement;
  const firstChild = row.firstElementChild;
  const vars = window.getComputedStyle(firstChild);
  offsetX -= parseInt(vars.getPropertyValue('--shift'));

  let lastUpdate = 0;

  /** @param {MouseEvent} e */
  function mouseMoveHandler(e) {
    if (Date.now() - lastUpdate > 50) {
      lastUpdate = Date.now();

      firstChild.style.setProperty('--shift', (e.pageX - offsetX) + 'px');
      row.childNodes.forEach((/** @type {HTMLElement} */ tile) => updateLabel(tile));
    }
  }

  function reset() {
    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', reset);
    row.classList.remove(className);
  }

  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('mouseup', reset);
  row.classList.add(className);
};
