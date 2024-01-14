import { appendChild, tileSize } from './util.mjs';

/**
 * @param {HTMLElement} tile
 */
export const updateLabel = (tile) => {
  const vars = window.getComputedStyle(tile);

  const width = Math.min(
    tileSize.width,
    tileSize.width + parseInt(vars.marginLeft),
    (tile.parentElement.clientWidth - tile.offsetLeft),
  );
  const height = (tileSize.height + parseInt(vars.marginTop));

  const sizes = [width, height].map((n) => `${Number((Math.round(n) / 10).toFixed(1))}"`);

  tile.title = sizes.join('x');
  tile.textContent = height < tileSize.height ? sizes.join('x') : sizes[0];
};

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
      const tileRow = appendChild(wall, { className: 'row' });

      // tiles
      const partial = (partialStart + tileSize.width * (rowIdx % rowShift) / rowShift) % tileSize.width;
      const startX = (partial > 0) ? (partial - tileSize.width) : partial;

      for (let rowW = 0; rowW < wallW; rowW += tileSize.width) {
        const tile = appendChild(tileRow, { className: 'tile' });

        if (rowW === 0 && startX) {
          tile.style.setProperty('--partialX', startX + 'px');
          rowW = startX;
        }
      }
    }

    wall.lastElementChild.style.setProperty('--partialY', (wall.clientHeight - wall.scrollHeight) + 'px');

    // get size from DOM
    document.querySelectorAll('div.tile').forEach((/** @type {HTMLElement} */ tile) => updateLabel(tile));
  });
};
