/**
 * @typedef Size
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Size & {offset: number, delta: number}} WallDef
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
 * @param {string} tagName
 * @param {string=} className
 */
export const appendChild = (parent, tagName, className) =>
  parent.appendChild(Object.assign(document.createElement(tagName), { className }));

/**
 * @param {Node} node
 * @param {string} name
 * @returns {HTMLInputElement}
 */
export const findInput = (node, name) =>
  // @ts-ignore
  node.querySelector(`input[name=${name}]`);


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
    wall.style.setProperty('--rowDelta', `${Number(formData.get('d')) * 10}px`);
    wall.style.setProperty('--rowShift', String(formData.get('x')));
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
    { width: 39, height: 92, offset: 2, delta: 0 },
    { width: 54, height: 92, offset: 2, delta: 0 },
    { width: 39, height: 92, offset: 2, delta: 0 },
  ];

  /** @type {HTMLTemplateElement} */
  const template = document.querySelector('#t_wall');

  document.querySelector('#walls').append(
    ...wallDefs.map((def) => {
      const clone = template.content.cloneNode(true);
      Object.entries(def).forEach(([key, val]) => {
        const input = findInput(clone, key.charAt(0));
        if (input) {
          input.value = String(val);
        }
      });
      return clone;
    }));
};

export const saveWalls = () => {
  /** @type {Array<WallDef>} */
  let wallDefs = [];

  document.querySelectorAll('#walls > .wall')
    .forEach((node) => {
      wallDefs.push({
        width: findInput(node, 'w').valueAsNumber,
        height: findInput(node, 'h').valueAsNumber,
        offset: findInput(node, 'x').valueAsNumber,
        delta: findInput(node, 'd').valueAsNumber,
      });
    });

  try {
    localStorage.setItem('walls', JSON.stringify(wallDefs));
  } catch (error) {
    console.error('localstorage');
  }
};
