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
          console.warn("Car recoloring unavailable", err);
          this.fallback = img;
        }
        this.ready = true;
        resolve();
      };
      img.onerror = reject;
      img.src = CAR_IMAGE_DATA;
    });
  },

  _prepare(img) {
    const w = img.width;
    const h = img.height;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d");
    g.drawImage(img, 0, 0);
    const image = g.getImageData(0, 0, w, h);
    const px = image.data;

    // Flood fill the light background in from the edges.
    const isLight = (i) => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) > 200;
    const background = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop();
      if (background[i] || !isLight(i)) continue;
      background[i] = 1;
      const x = i % w;
      const y = (i - x) / w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - w);
      if (y < h - 1) stack.push(i + w);
    }

    // Clear the background and soften the outline's anti-aliased edge so it
    // doesn't leave a white halo.
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = (i - x) / w;
      if (background[i]) {
        px[i * 4 + 3] = 0;
        continue;
      }
      const touchesBackground =
        (x > 0 && background[i - 1]) || (x < w - 1 && background[i + 1]) ||
        (y > 0 && background[i - w]) || (y < h - 1 && background[i + w]);
      if (touchesBackground) {
        const v = Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
        px[i * 4 + 3] = Math.round(clamp((255 - v) / 230, 0, 1) * 255);
        px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = 25;
      }
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const cropped = new ImageData(cw, ch);
    // Lightness of each paint pixel, or -1 for anything that isn't paint.
    const paint = new Float32Array(cw * ch).fill(-1);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const src = ((y + minY) * w + (x + minX)) * 4;
        const dst = (y * cw + x) * 4;
        for (let k = 0; k < 4; k++) cropped.data[dst + k] = px[src + k];
        if (px[src + 3] === 0) continue;
        const { h: hue, s, l } = rgbToHsl(px[src], px[src + 1], px[src + 2]);
        const orange = hue < 50 / 360 || hue > 350 / 360;
        if (orange && s > 0.4 && l > 0.12 && l < 0.92) paint[y * cw + x] = l;
      }
    }

    this.source = cropped;
    this.paint = paint;
    // Lightness of the main body color (#fd6014).
    this.baseLightness = 0.535;

  },

  get(color) {
    if (this.fallback) return this.fallback;
    let sprite = this.cache.get(color);
    if (!sprite) {
      sprite = this._tint(color);
      this.cache.set(color, sprite);
    }
    return sprite;
  },

  _tint(color) {
    const { r, g, b } = hexToRgb(color);
    const target = rgbToHsl(r, g, b);
    const base = this.baseLightness;
    const image = new ImageData(new Uint8ClampedArray(this.source.data), this.source.width, this.source.height);
    const data = image.data;
    for (let i = 0; i < this.paint.length; i++) {
      const l = this.paint[i];
      if (l < 0) continue;
      // Keep the shading: darker-than-base paint maps darker than the target color, lighter maps lighter.
      const newL = l <= base ? (target.l * l) / base : target.l + ((1 - target.l) * (l - base)) / (1 - base);
      const c = hslToRgb(target.h, target.s, clamp(newL, 0, 1));
      data[i * 4] = c.r;
      data[i * 4 + 1] = c.g;
      data[i * 4 + 2] = c.b;
    }

    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").putImageData(image, 0, 0);

    // Scale down in halves for a smoother result than one big jump.
    const targetWidth = CONFIG.car.length * this.scale;
    while (canvas.width / 2 >= targetWidth) canvas = this._resize(canvas, canvas.width / 2);
    return this._resize(canvas, targetWidth);
  },

  _resize(source, width) {
    const height = Math.round((source.height * width) / source.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width);
    canvas.height = height;
    const g = canvas.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas;
  },


};
