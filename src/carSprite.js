/**
 * Converts images/car.png into sprites of any color.
 *
 * On load we cut away the white background, crop to the car, and mark which
 * pixels are orange paint. `get(color)` then repaints just those pixels, keeping
 * the original shading, and caches the result. Windows, tires and outlines stay
 * as they are.
 */
const CarSprite = {
  // Sprites are stored at 4x their on-screen size so they stay sharp when zoomed or on HiDPI screens.
  scale: 4,
  ready: false,
  cache: new Map(),

  load() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          this._prepare(img);
        } catch(err) {
          // Pixel access failed; fall back to the original orange car.
          console.war("Car recoloring unavailable", err);
          this.fallback = img;
        }
        this.ready = true;
        resolve();
      };
    });
  }

};
