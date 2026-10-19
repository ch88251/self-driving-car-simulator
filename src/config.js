/**
 * Tunable numbers for the whole simulation. Distances are in pixels, speeds in
 * pixels/second, accelerations in pixels/second².
 */
const CONFIG = {

  // Used only to show speeds in mph. A 56px car is about 4.5m long.
  pxPerMeter: 12.5,

  road: {
    laneCount: 3,
    laneWidth: 50,
    sidewalk: 14,
    // Gap between the stop line and the edge of the intersection box.
    stopLineGap: 8,
    // Lane divider dash pattern: [dash, gap].
    dash: [18, 22],
  },

  car: {
    length: 56,
    width: 28,
    maxSpeed: [140, 220],
    maxAccel: [40, 60],
    comfortBrake: 55,
    // Roughly 1g.
    maxBrake: 120,
    // Seconds of following distance the car tries to keep.
    timeHeadway: 1.2,
    // Bumper-to-bumper gap when stopped behind another car.
    minGap: 12,
    turnSpeed: 55,
    maxCurvature: 1 / 22,
  },

  colors: {
    ground: "#3b5a3a",
    sidewalk: "#a9a9a2",
    asphalt: "#4a4c50",
    line: "#f4f4f4",
    cars: [
      "#e63946", "#1d4ed8", "#f59e0b", "#10b981", "#8b5cf6", "#f1f5f9",
      "#1f2937", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#facc15",
    ],
  },
}
