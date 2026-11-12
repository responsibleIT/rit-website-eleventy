function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(7);
  noiseSeed(7);

  const palette = [
    color("#e85a12"),
    color("#9fc6c8"),
    color("#eddcae"),
    color("#8b4328")
  ];
  const orange = palette[0];
  const blue = palette[1];
  const beige = palette[2];
  const brown = palette[3];

  background(beige);

  const tile = 736;
  const s = height / tile;
  const scaledTile = tile * s;

  noStroke();

  for (let x = 0; x < width + scaledTile; x += scaledTile) {
    push();
    translate(x, 0);
    scale(s);
    drawPatternTile(orange, blue, brown);
    pop();
  }

  addPrintTexture();
  blendMode(BLEND);
}

function drawPatternTile(orange, blue, brown) {
  fill(orange);

  quad(184, 0, 368, 184, 184, 368, 0, 184);

  rect(368, 0, 92, 92);
  triangle(460, 92, 552, 0, 644, 92);
  rect(644, 0, 92, 92);

  triangle(368, 184, 460, 92, 460, 276);
  quad(552, 92, 644, 184, 552, 276, 460, 184);
  triangle(644, 92, 736, 184, 644, 276);

  rect(368, 276, 92, 92);
  triangle(460, 276, 552, 368, 644, 276);
  rect(644, 276, 92, 92);

  quad(552, 368, 736, 552, 552, 736, 368, 552);

  rect(0, 368, 92, 92);
  triangle(92, 460, 184, 368, 276, 460);
  rect(276, 368, 92, 92);

  triangle(0, 552, 92, 460, 92, 644);
  quad(184, 460, 276, 552, 184, 644, 92, 552);
  triangle(276, 460, 368, 552, 276, 644);

  rect(0, 644, 92, 92);
  triangle(92, 644, 184, 736, 276, 644);
  rect(276, 644, 92, 92);

  fill(blue);

  triangle(460, 92, 552, 0, 644, 92);
  quad(552, 92, 644, 184, 552, 276, 460, 184);
  triangle(460, 276, 552, 368, 644, 276);

  triangle(92, 460, 184, 368, 276, 460);
  quad(184, 460, 276, 552, 184, 644, 92, 552);
  triangle(92, 644, 184, 736, 276, 644);

  fill(brown);

  rect(368, 0, 92, 92);
  rect(644, 0, 92, 92);
  triangle(368, 184, 460, 92, 460, 276);
  triangle(644, 92, 736, 184, 644, 276);

  rect(0, 368, 92, 92);
  rect(276, 368, 92, 92);
  triangle(0, 552, 92, 460, 92, 644);
  triangle(276, 460, 368, 552, 276, 644);
}

function addFabricTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);

      const grain =
        noise(x * 0.015, y * 0.015) * 11 +
        noise(x * 0.08, y * 0.08) * 5 +
        sin(x * 0.7) * 1.7 +
        sin(y * 0.75) * 1.7 +
        random(-2.2, 2.2) -
        8;

      pixels[i] = constrain(pixels[i] + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain * 0.85, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain * 0.55, 0, 255);
    }
  }

  updatePixels();

  push();
  blendMode(MULTIPLY);
  stroke(110, 90, 35, 10);
  strokeWeight(1);

  for (let y = 0; y < height; y += 3) {
    line(0, y, width, y);
  }

  for (let x = 0; x < width; x += 4) {
    line(x, 0, x, height);
  }

  pop();
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
