function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

function draw() {
  const sx = width / 371;
  const sy = height / 375;

  const X = v => v * sx;
  const Y = v => v * sy;

  background(122, 112, 72);

  noStroke();

  // black stepped mass
  fill(10, 18, 16);
  beginShape();
  vertex(X(0), Y(0));
  vertex(X(20), Y(0));
  vertex(X(20), Y(48));
  vertex(X(45), Y(48));
  vertex(X(45), Y(95));
  vertex(X(91), Y(95));
  vertex(X(91), Y(188));
  vertex(X(185), Y(188));
  vertex(X(185), Y(375));
  vertex(X(0), Y(375));
  endShape(CLOSE);

  // orange stepped blocks
  fill(255, 91, 43);
  rect(X(21), Y(24), X(24), Y(25));
  rect(X(45), Y(48), X(47), Y(47));
  rect(X(92), Y(94), X(93), Y(94));
  rect(X(185), Y(188), X(186), Y(187));

  // blue diagonal stair triangles / blocks
  fill(0, 120, 235);

  triangle(X(21), Y(24), X(45), Y(49), X(21), Y(49));

  beginShape();
  vertex(X(45), Y(48));
  vertex(X(92), Y(95));
  vertex(X(45), Y(95));
  endShape(CLOSE);

  beginShape();
  vertex(X(92), Y(94));
  vertex(X(185), Y(188));
  vertex(X(92), Y(188));
  endShape(CLOSE);

  beginShape();
  vertex(X(185), Y(188));
  vertex(X(371), Y(375));
  vertex(X(185), Y(375));
  endShape(CLOSE);

  // thin white diagonal edge
  stroke(245, 238, 225);
  strokeWeight(width * 0.00115);
  line(X(22), Y(24), X(371), Y(375));

  addPrintTexture()
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
    fill(110, 70, 35, random(2, 7));
    rect(random(width), random(height), random(30, 180), random(1, 4));
  }
  blendMode(BLEND);
}
