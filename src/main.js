/**
 * Starts the simulation in the browser: sizes the canvas, runs the
 * update/draw loop, and wires up mouse and keyboard controls.
 */
(async function main() {
  const canvas = document.getElementById("sim");
  const ctx = canvas.getContext("2d");
  const options = { paused: false, speed: 1, sensors: "selected" };

  await CarSprite.load();
  document.getElementById("loading").remove();

  const sim = new Simulation(window.innerWidth, window.innerHeight);

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = CONFIG.colors.ground;

    ctx.save();
  }

  let last = performance.now();
  function frame(now) {
    // Cap the step so a background tab doesn't cause one huge jump.
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    if (!options.paused) {
      for (let i = 0; i < options.speed; i++) sim.step(dt);
    }
    draw();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

})();

