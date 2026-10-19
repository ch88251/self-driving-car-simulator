/**
 * A Car knows its position, heading, speed and color, and simulates simple
 * physics: speed changes are limited by how hard the car can accelerate and
 * brake, and it steers along arcs instead of turning in place.
 *
 * Driving decisions come from its Autopilot, which only knows what the car's
 * Sensor tells it.
 */
class Car {
  constructor({ id, x, y, angle, color, maxSpeed, speed = 0, road, lane, route }) {
    this.id = id;
    this.x = x;
    this.y = y;
    // Radians; 0 points right (east), -PI/2 points up (north).
    this.angle = angle;
    this.length = CONFIG.car.length;
    this.width = CONFIG.car.width;
    this.color = color;
    this.maxSpeed = maxSpeed;
    this.speed = speed;
    this.accel = 0;
    this.maxAccel = randRange(CONFIG.car.maxAccel);
    this.comfortBrake = CONFIG.car.comfortBrake;
    this.maxBrake = CONFIG.car.maxBrake;
    this.damaged = false;
    this.damagedTime = 0;
    this.blinker = null;
    this.turnsMade = 0;
  }
}
