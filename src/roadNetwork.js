/**
 * All the roads: one vertical Main Ave (northbound) plus horizontal one-way
 * cross streets that get built ahead of the camera roughly every 30 seconds.
 * Cross streets are numbered 1st St, 2nd St, ... going north.
 */
class RoadNetwork {
  constructor() {
    this.main = new Road({
      id: 0,
      name: "Main Ave",
      orientation: "vertical",
      position: 0,
      direction: { x: 0, y: -1 },
    });
    this.crossRoads = [];
    this.intersections = [];
    this.streetCount = 0;
  }
}
