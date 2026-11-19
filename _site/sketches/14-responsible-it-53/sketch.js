function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  background(248, 245, 201);

  const W = width;
  const H = height;

  const cream = "#eddcae";
  const red = "#e96522";
  const cyan = "#9fc6c8";

  noStroke();

  // Main geometric fields
  fill(cream);
  rect(0, 0, W, H);

  // Red left hourglass
  fill(red);
  beginShape();
  vertex(0, 0);
  vertex(W * 0.505, 0);
  vertex(W * 0.505, H * 0.50);
  vertex(W * 0.335, H * 0.665);
  endShape(CLOSE);

  beginShape();
  vertex(W * 0.335, H * 0.665);
  vertex(W * 0.505, H * 1.0);
  vertex(0, H * 1.0);
  endShape(CLOSE);

  // Blue right hourglass
  fill(cyan);
  beginShape();
  vertex(W * 0.525, 0);
  vertex(W, 0);
  vertex(W * 0.665, H * 0.335);
  endShape(CLOSE);

  beginShape();
  vertex(W * 0.665, H * 0.335);
  vertex(W, H);
  vertex(W * 0.505, H);
  vertex(W * 0.505, H * 0.50);
  endShape(CLOSE);

  // Slight imperfect paper edge
  stroke(232, 229, 185, 170);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let y = 0; y <= H; y += 18) vertex(8 + noise(y * 0.01) * 8, y);
  endShape();
  beginShape();
  for (let y = 0; y <= H; y += 18) vertex(W - 8 - noise(100 + y * 0.01) * 8, y);
  endShape();

  // Subtle ink speckles
  noStroke();
  for (let i = 0; i < 18000; i++) {
    const x = random(W);
    const y = random(H);
    const a = random(7, 22);
    fill(40, 35, 20, a);
    circle(x, y, random(0.4, 1.8));
  }

  // Light color mottling inside printed areas
  blendMode(MULTIPLY);
  for (let i = 0; i < 7000; i++) {
    fill(255, random(5, 16));
    circle(random(W), random(H), random(1, 4));
  }
  blendMode(BLEND);
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