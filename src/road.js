class Road {
  constructor({ id, name, orientation, position, direction }) {
    this.id = id;
    this.name = name;
    this.orientation = orientation;
    // x of a vertical road's center line, or y of a horizontal one
    this.position = position;
    this.dir = direction;
    this.right = { x: -direction.y, y: direction.x };
    this.heading = Math.atan2(direction.y, direction.x);
    this.laneCount = CONFIG.road.laneCount;
    this.laneWidth = CONFIG.road.laneWidth;
    this.width = this.laneCount * this.laneWidth;
    this.anchor = this.isVertical ? { x: position, y: 0 } : { x: 0, y: position };
    // Sorted in the direction of travel
    this.intersections = [];
  }

}
