window.onload = () => {
  let tileW, tileH;

  const draw = () => {
    document.querySelectorAll('div.wall').forEach((wall) => {
      wall.textContent = '';

      const gap = parseInt(window.getComputedStyle(document.body).getPropertyValue('--gap'));
      const { clientWidth: wallW, clientHeight: wallH } = wall;

      if (wallH <= gap) {
        return;
      }

      const makeTile = (width = 0, height = 0) => {
        const sizes = [width, height].map((n) => `${Number((n / 10).toPrecision(2))}"`);

        const tile = wall.appendChild(
          Object.assign(document.createElement('div'), {
            className: 'tile',
            title: sizes.join('x'),
          })
        )
        if (width && width < tileW) {
          tile.style.width = (width - gap) + 'px';
        }
        if (height && height < tileH) {
          tile.style.height = (height - gap) + 'px';
          tile.textContent = sizes.join('x');
        } else {
          tile.textContent = sizes[0];
        }

        return tile;
      };

      const fullTiles = Math.floor(wallW / tileW);
      const rowStart = (r) => {
        const partial = (wallW - fullTiles * tileW - tileW * (r % 3)) / 2;
        return (partial < 0) ? tileW + partial : partial;
      };

      const rows = Math.ceil(wallH / tileH);

      // row
      for (let rowIdx = 0, rowH = tileH; rowIdx < rows; rowIdx++, rowH += tileH) {
        console.debug('row=', rowIdx + 1);
        const h = (rowH > wallH) ? (wallH - (rowH - tileH)) : tileH;

        // tiles
        for (let w = rowStart(rowIdx), rowW = w; ; rowW += tileW, w = tileW) {
          console.debug('tile=', {w});
          if (rowW >= wallW) {
            w = wallW - (rowW - w);
            if (w < 0) {
              break;
            }

            makeTile(w, h);
            break;
          }

          makeTile(w, h);
        }
      }
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
      } else {
        document.body.style.setProperty('--tileW', `${w}px`);
        document.body.style.setProperty('--tileH', `${h}px`);
        tileW = w;
        tileH = h;
      }
    };

    form.onsubmit = (e) => e.preventDefault();

    form.querySelectorAll('input').forEach((input) => {
      input.onchange = () => setSize();
    });
    setSize();
  });

  draw();
};

