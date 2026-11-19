// p5.js code to create a seamless geometric pattern with a Riso-style texture

// Constants for the pattern
const tileWidth = 100; // Width of a single tile
const tileHeight = 100; // Height of a single tile
const angle = 45; // Angle for the diagonal bands
const colors = {
  burntOrange: '#9fc6c8',
  lightBlue: '#4C131A',
  darkBrown: '#6F8960',
  mediumBrown: '#eddcae',
  cream: '#205140',
  nearBlack: '#151515'
};

"#9fc6c8";
"#4C131A";
"#6F8960";
"#eddcae";
"#205140";
function setup() {
  createCanvas(1920, 1080);
  noLoop(); // Draw once for static pattern
}

function draw() {
  background(colors.cream);
  drawPattern();
  addRisoTexture();
}

// Function to draw a single tile
function drawTile(x, y, isOffsetRow) {
  push();
  translate(x, y);

  // Alternate diagonal band colors
  const bandColor = isOffsetRow ? colors.darkBrown : colors.mediumBrown;

  // Draw left diagonal parallelogram
  fill(bandColor);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(tileWidth / 2, tileHeight / 2);
  vertex(tileWidth / 2, tileHeight * 1.5);
  vertex(0, tileHeight);
  endShape(CLOSE);

  // Draw right diagonal parallelogram
  beginShape();
  vertex(tileWidth, 0);
  vertex(tileWidth * 1.5, tileHeight / 2);
  vertex(tileWidth * 1.5, tileHeight * 1.5);
  vertex(tileWidth, tileHeight);
  endShape(CLOSE);

  // Draw center square
  const squareColor = isOffsetRow ? colors.burntOrange : colors.lightBlue;
  fill(squareColor);
  rect(tileWidth / 2, tileHeight / 2, tileWidth, tileHeight);

  pop();
}

// Function to draw the entire pattern
function drawPattern() {
  const cols = ceil(width / tileWidth);
  const rows = ceil(height / tileHeight);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileWidth;
      const y = row * tileHeight;

      // Offset every other row for zig-zag effect
      const isOffsetRow = row % 2 === 1;
      const offsetX = isOffsetRow ? tileWidth / 2 : 0;

      drawTile(x + offsetX, y, isOffsetRow);
    }
  }
}

// Function to add a Riso-style texture
function addRisoTexture() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (x + y * width) * 4;

      // Add subtle noise to each pixel
      const noiseValue = random(-10, 10);
      pixels[index] += noiseValue; // Red
      pixels[index + 1] += noiseValue; // Green
      pixels[index + 2] += noiseValue; // Blue
    }
  }
  updatePixels();
}