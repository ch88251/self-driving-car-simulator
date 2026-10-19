class Simulation {
  constructor(width, height) {
    this.network = new RoadNetwork();
    this.time = 0;

  }

  step(dt) {
    this.time += dt;
  }

}
