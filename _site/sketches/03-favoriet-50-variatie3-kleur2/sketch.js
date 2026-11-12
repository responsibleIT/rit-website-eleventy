function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(12);
  background("#e85a12");

  const angle = -PI / 7;
  const gridW = width * 1.35;
  const gridH = height * 1.85;
  const cols = 10;
  const rows = 2;
  const cw = gridW / cols;
  const rh = gridH / rows;

  const red = "#6F8960";
  const deepRed = "#4C131A";
  const darkRed = "#4C131A";
  const orange = "#205140";
  const yellow = "#9fc6c8";
  const brown = "#eddcae";
  const clay = "#eddcae";

  function poly(col, pts) {
    fill(col);
    noStroke();
    beginShape();
    for (const p of pts) vertex(p[0], p[1]);
    endShape(CLOSE);
  }

  function cell(c, r, bg, layers) {
    const x = -gridW / 2 + c * cw;
    const y = -gridH / 2 + r * rh;

    poly(bg, [
      [x, y],
      [x + cw, y],
      [x + cw, y + rh],
      [x, y + rh]
    ]);

    for (const layer of layers) {
      poly(
        layer[0],
        layer[1].map(p => [x + p[0] * cw, y + p[1] * rh])
      );
    }
  }

  push();
  translate(width / 2, height / 2);
  rotate(angle);

  cell(0, 0, red, [
    [yellow, [[0, 0], [0, 1], [1, 1]]]
  ]);

  cell(0, 1, brown, [
    [deepRed, [[0, 0], [1, 0], [0.55, 1]]],
    [clay, [[0, 0], [0.55, 1], [0, 1]]]
  ]);

  cell(1, 0, brown, [
    [deepRed, [[0.05, 0], [1, 0], [1, 1], [0, 0.58]]],
    [darkRed, [[0, 0], [0.05, 0], [0, 1]]]
  ]);

  cell(1, 1, orange, [
    [red, [[0, 0], [1, 0], [0.6, 1]]],
    [deepRed, [[0, 0], [0.6, 1], [0, 1]]]
  ]);

  cell(2, 0, red, [
    [yellow, [[0.1, 0], [1, 1], [0, 1]]]
  ]);

  cell(2, 1, brown, [
    [deepRed, [[0, 0], [1, 0], [0.58, 1]]],
    [clay, [[0, 0], [0.58, 1], [0, 1]]]
  ]);

  cell(3, 0, brown, [
    [deepRed, [[0.1, 0], [1, 0], [1, 1], [0, 0.92]]],
    [darkRed, [[0, 0], [0.1, 0], [0, 0.92]]]
  ]);

  cell(3, 1, orange, [
    [red, [[0, 0], [1, 0], [0.72, 1]]],
    [deepRed, [[0, 0], [0.72, 1], [0, 1]]]
  ]);

  cell(4, 0, red, [
    [yellow, [[0.18, 0], [1, 1], [0, 1]]],
    [orange, [[0, 1], [0.18, 0], [0, 0]]]
  ]);

  cell(4, 1, brown, [
    [deepRed, [[0, 0], [1, 0], [0.78, 1], [0, 0.18]]]
  ]);

  cell(5, 0, brown, [
    [deepRed, [[0.22, 0], [1, 1], [0, 1]]],
    [deepRed, [[0, 0], [0.22, 0], [0, 1]]]
  ]);

  cell(5, 1, red, [
    [yellow, [[0, 0], [1, 0], [0.88, 1]]],
    [brown, [[0, 0], [0.88, 1], [0, 1]]]
  ]);

  cell(6, 0, red, [
    [orange, [[0.28, 0], [1, 1], [0, 1]]],
    [yellow, [[0, 1], [0.28, 0], [0, 0]]]
  ]);

  cell(6, 1, brown, [
    [deepRed, [[0, 0], [1, 0], [0.98, 1]]],
    [red, [[0, 0], [0.98, 1], [0, 1]]]
  ]);

  cell(7, 0, brown, [
    [deepRed, [[0.34, 0], [1, 1], [0, 1]]],
    [deepRed, [[0, 0], [0.34, 0], [0, 1]]]
  ]);

  cell(7, 1, red, [
    [yellow, [[0, 0], [1, 0], [0.9, 1]]],
    [brown, [[0, 0], [0.9, 1], [0, 1]]]
  ]);

  cell(8, 0, red, [
    [orange, [[0.38, 0], [1, 1], [0, 1]]]
  ]);

  cell(8, 1, brown, [
    [darkRed, [[0, 0], [1, 0], [1, 1], [0, 0.35]]]
  ]);

  cell(9, 0, brown, [
    [deepRed, [[0.45, 0], [1, 1], [0, 1]]]
  ]);

  cell(9, 1, red, [
    [yellow, [[0, 0], [1, 0], [1, 1]]],
    [brown, [[0, 0], [1, 1], [0, 1]]]
  ]);

  stroke(0, 35);
  strokeWeight(2);
  line(-gridW / 2, 0, gridW / 2, 0);
  pop();

  addPrintTexture();
}

function addPrintTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (x + y * width);
      const n = noise(x * 0.018, y * 0.018);
      const grain = random(-18, 14) + map(n, 0, 1, -10, 10);

      pixels[i] = constrain(pixels[i] + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255);
    }
  }

  updatePixels();

  noStroke();

  for (let i = 0; i < 32000; i++) {
    fill(255, random(5, 18));
    circle(random(width), random(height), random(0.4, 1.6));
  }

  for (let i = 0; i < 18000; i++) {
    fill(0, random(3, 10));
    circle(random(width), random(height), random(0.35, 1.1));
  }

  blendMode(MULTIPLY);
  for (let i = 0; i < 420; i++) {
    fill(70, 43, 32, random(3, 8));
    rect(random(width), random(height), random(30, 180), random(1, 4));
  }
  blendMode(BLEND);
}
