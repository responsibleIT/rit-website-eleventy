// Color palette
const BURNT_ORANGE = "#1C717E";
const LIGHT_BLUE = "#1C717E";
const DARK_BROWN = "#d7c79a";
const MED_BROWN = "#9fc6c8";
const CREAM = "#d7c79a";
const NEAR_BLACK = "#EBD9AB";
const BRIGHT_ORANGE = "#513244"; // Additional orange for more vibrancy

turquoise= "#1C717E";
paars = "#513244";
oranje = "#C76E3C";
blauw = "#9fc6c8";
beige = "#d7c79a";

function setup() {
  createCanvas(1920, 1080);
  noLoop();

  drawFullCanvasPattern();
  applyRisoEffect();
}

/**
 * Draw the optical pattern across the entire canvas,
 * with no empty or plain borders.
 */
function drawFullCanvasPattern() {
  background(CREAM); // base, fully covered by the pattern

  const cols = 8; // number of diagonal strip columns
  const rows = 6; // vertical repetition
  const cellW = width / cols; // logical cell width
  const cellH = height / (rows + 1);
  const skew = cellW * 0.6; // horizontal skew per row (controls angle)

  noStroke();

  // Layer 1: warm/orange + cream / brown family
  for (let row = -2; row <= rows + 2; row++) {
    for (let col = -2; col <= cols + 2; col++) {
      const baseX = col * cellW + row * (skew * 0.5);
      const baseY = row * cellH;

      const colorIndex = (col + row * 2 + 4) % 4;
      let fillColor;
      if (colorIndex === 0) {
        fillColor = BURNT_ORANGE;
      } else if (colorIndex === 1) {
        fillColor = BRIGHT_ORANGE; // More orange
      } else if (colorIndex === 2) {
        fillColor = MED_BROWN;
      } else {
        fillColor = BURNT_ORANGE;
      }

      drawParallelogram(baseX, baseY, cellW, cellH * 1.3, skew, fillColor);
    }
  }

  // Layer 2: cool/light-blue and dark-brown ribbons
  for (let row = -3; row <= rows + 3; row++) {
    for (let col = -3; col <= cols + 3; col++) {
      const baseX = col * cellW + row * (skew * 0.5) + cellW * 0.35;
      const baseY = row * cellH + cellH * 0.25;

      const bandSelector = (col - row + 8) % 4;
      let fillColor;
      if (bandSelector === 0) {
        fillColor = LIGHT_BLUE;
      } else if (bandSelector === 1) {
        fillColor = DARK_BROWN;
      } else if (bandSelector === 2) {
        fillColor = LIGHT_BLUE;
      } else {
        fillColor = DARK_BROWN;
      }

      drawParallelogram(baseX, baseY, cellW, cellH * 1.3, skew, fillColor);
    }
  }
}

/**
 * Draw a single skewed parallelogram.
 *
 * The shape is defined as a rectangle of width rectW and height rectH,
 * where the top edge is shifted by "skew" relative to the bottom.
 */
function drawParallelogram(x, y, rectW, rectH, skew, fillColor) {
  fill(fillColor);
  beginShape();
  vertex(x, y);
  vertex(x + rectW, y);
  vertex(x + rectW + skew, y + rectH);
  vertex(x + skew, y + rectH);
  endShape(CLOSE);
}

/**
 * Apply a Riso effect to the canvas by adding a grainy texture.
 */
function applyRisoEffect() {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const grain = random(-20, 20);
    pixels[i] = constrain(pixels[i] + grain, 0, 255); // Red
    pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255); // Green
    pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255); // Blue
  }
  updatePixels();
}