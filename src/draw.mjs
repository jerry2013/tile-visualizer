import { appendChild, tileSize } from './util.mjs';

export const draw = () => {
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

    const partialStart = rowDelta + (wallW - Math.floor(wallW / tileSize.width) * tileSize.height) / 2;

    const rows = Math.ceil(wallH / tileSize.height);

    // row
    for (let rowIdx = 0, rowH = tileSize.height; rowIdx < rows; rowIdx++, rowH += tileSize.height) {
      const tileRow = appendChild(wall, 'div', 'row');

      // tiles
      const partial = (partialStart + tileSize.width * (rowIdx % rowShift) / rowShift) % tileSize.width;
      const startX = (partial > 0) ? (partial - tileSize.width) : partial;

      for (let rowW = 0; startX + rowW < wallW; rowW += tileSize.width) {
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
      tile.textContent = height < tileSize.height ? sizes.join('x') : sizes[0];
    });
  });
};
