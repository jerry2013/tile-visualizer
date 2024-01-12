window.onload = () => {
  let tileW, tileH;

  /**
   * @param {Element} parent
   * @param {string} tagName
   * @param {string=} className
   */
  const appendChild = (parent, tagName, className) => parent.appendChild(
    Object.assign(document.createElement(tagName), { className }),
  );

  const wallDefs = [
    { w: 39, h: 92, x: 2 },
    { w: 54, h: 92, x: 2 },
    { w: 39, h: 92, x: 2 },
  ];
  const container = document.querySelector('#walls');
  const template = document.querySelector('#t_wall');
  wallDefs.forEach((def) => {
    /** @type {HTMLElement} */
    const clone = template.content.cloneNode(true);
    Object.entries(def).forEach(([key, val]) => (clone.querySelector(`input[name=${key}]`).value = val));
    container.appendChild(clone);
  });

  const draw = () => {
    document.querySelectorAll('div.wall').forEach((wall) => {
      wall.textContent = '';

      const vars = window.getComputedStyle(wall);
      const gap = parseInt(vars.getPropertyValue('--gap'));
      const rowShift = parseInt(vars.getPropertyValue('--rowShift')) || 3;
      const rowDelta = parseInt(vars.getPropertyValue('--rowDelta')) || 0;

      const { clientWidth: wallW, clientHeight: wallH } = wall;

      if (wallH <= gap) {
        return;
      }

      const partialStart = rowDelta + (wallW - Math.floor(wallW / tileW) * tileW) / 2;
      const rowStart = (rowIdx) => {
        const partial = (partialStart + tileW * (rowIdx % rowShift) / rowShift);
        return (partial > 0) ? partial - tileW : partial;
      };

      const rows = Math.ceil(wallH / tileH);

      // row
      for (let rowIdx = 0, rowH = tileH; rowIdx < rows; rowIdx++, rowH += tileH) {
        const tileRow = appendChild(wall, 'div', 'row');

        // tiles
        const startX = rowStart(rowIdx);
        for (let rowW = 0; startX + rowW < wallW; rowW += tileW) {
          const tile = appendChild(tileRow, 'div', 'tile');

          if (rowW === 0 && startX) {
            tile.style.setProperty('--partialX', startX + 'px');
          }
        }

        tileRow.lastElementChild.style.setProperty('--partialX', (tileRow.clientWidth - tileRow.scrollWidth) + 'px');
      }

      wall.lastElementChild.style.setProperty('--partialY', (wall.clientHeight - wall.scrollHeight) + 'px');

      // get size from DOM
      document.querySelectorAll('div.tile').forEach((/** @type {HTMLElement} */tile) => {
        const width = (tile.clientWidth + gap);
        const height = (tile.clientHeight + gap);

        const sizes = [width, height].map((n) => `${Number((n / 10).toPrecision(2))}"`);
        tile.title = sizes.join('x');
        tile.textContent = height < tileH ? sizes.join('x') : sizes[0];
      });
    });
  };

  document.querySelectorAll('form').forEach((form) => {
    const setSize = () => {
      const formData = new FormData(form);

      const w = Number(formData.get('w')) * 10;
      const h = Number(formData.get('h')) * 10;

      /** @type {HTMLDivElement} */
      const wall = form.parentElement.querySelector('div.wall');
      if (wall) {
        wall.style.setProperty('--width', `${w}px`);
        wall.style.setProperty('--height', `${h}px`);
        wall.style.setProperty('--rowDelta', `${Number(formData.get('d')) * 10}px`);
        wall.style.setProperty('--rowShift', formData.get('x'));
      } else {
        document.body.style.setProperty('--gap', `${Number(formData.get('gap')) * 10}px`);
        document.body.style.setProperty('--tileW', `${w}px`);
        document.body.style.setProperty('--tileH', `${h}px`);
        tileW = w;
        tileH = h;
      }
    };

    form.onsubmit = (e) => e.preventDefault();

    form.querySelectorAll('input').forEach((input) => {
      input.onchange = () => {
        setSize();
        draw();
      };
    });

    setSize();
  });

  draw();
};
