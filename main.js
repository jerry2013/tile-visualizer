window.onload = () => {
  let tileW, tileH;

  const draw = () => {
    document.querySelectorAll('div.wall').forEach((wall) => {
      wall.textContent = '';

      const vars = window.getComputedStyle(wall);
      const gap = parseInt(vars.getPropertyValue('--gap'));
      const rowShift = parseInt(vars.getPropertyValue('--rowShift')) || 3;
      const { clientWidth: wallW, clientHeight: wallH } = wall;

      if (wallH <= gap) {
        return;
      }

      const makeTile = ({ tileRow, width = 0, height = 0 } = {}) => {
        const sizes = [width, height].map((n) => `${Number((n / 10).toPrecision(2))}"`);

        const tile = tileRow.appendChild(
          Object.assign(document.createElement('div'), {
            className: 'tile',
            title: sizes.join('x'),
          }),
        );

        if (height && height < tileH) {
          tile.textContent = sizes.join('x');
        } else {
          tile.textContent = sizes[0];
        }

        return tile;
      };

      const partialStart = (wallW - Math.floor(wallW / tileW) * tileW) / 2;
      const rowStart = (rowIdx) => {
        const partial = (partialStart + tileW * (rowIdx % rowShift) / rowShift);
        console.debug({ partial });
        return (partial > 0) ? partial - tileW : partial;
      };

      const rows = Math.ceil(wallH / tileH);

      // row
      for (let rowIdx = 0, rowH = tileH; rowIdx < rows; rowIdx++, rowH += tileH) {
        console.debug('row=', rowIdx + 1);
        const tileRow = wall.appendChild(
          Object.assign(document.createElement('div'), {
            className: 'row',
          }),
        );

        // tiles
        const startX = rowStart(rowIdx);
        for (let rowW = 0; startX + rowW < wallW; rowW += tileW) {
          console.debug('tile=', { startX, rowW });
          const tile = makeTile({ tileRow });
          if (rowW === 0 && startX) {
            tile.style.setProperty('--partialX', startX + 'px');
          }
        }

        tileRow.lastElementChild.style.setProperty('--partialX', (tileRow.clientWidth - tileRow.scrollWidth) + 'px');
      }

      wall.lastElementChild.style.setProperty('--partialY', (wall.clientHeight - wall.scrollHeight) + 'px');
    });
  };

  document.querySelectorAll('form').forEach((form) => {
    const setSize = () => {
      const formData = new FormData(form);

      const w = Number(formData.get('w')) * 10;
      const h = Number(formData.get('h')) * 10;

      const wall = form.parentElement.querySelector('div.wall');
      if (wall) {
        wall.style.setProperty('--width', `${w}px`);
        wall.style.setProperty('--height', `${h}px`);
        wall.style.setProperty('--rowShift', formData.get('x'));
      } else {
        document.body.style.setProperty('--gap', `${Number(formData.get('gap'))}px`);
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
