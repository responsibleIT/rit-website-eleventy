function setup() {
  createCanvas(1920, 1080);
  noLoop();
  noStroke();
  pixelDensity(1);
}


function draw() {
  const W = width;
  const H = height;

  background("#e85a12");

  fill("#e85a12");
  rect(0, 0, W, H * 0.495);

  fill("#eddcae");
  rect(0, H * 0.495, W, H * 0.505);

  fill("#9fc6c8");
  beginShape();
  vertex(0, 0);
  vertex(W, 0);
  vertex(0, H * 0.495);
  endShape(CLOSE);

  fill("#8b4328");
  beginShape();
  vertex(W * 0.25, H * 0.37);
  vertex(W * 0.75, H * 0.37);
  vertex(W * 0.75, H * 0.125);
  endShape(CLOSE);

  fill("#9fc6c8");
  rect(W * 0.248, H * 0.62, W * 0.502, H * 0.255);

  fill("#5a3728");
  beginShape();
  vertex(0, H);
  vertex(W, H * 0.495);
  vertex(W, H);
  endShape(CLOSE);

  addPaintTexture();
}

function addPaintTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);

      const n1 = noise(x * 0.006, y * 0.006);
      const n2 = noise(x * 0.035 + 40, y * 0.035 + 80);
      const grain = random(-10, 10);
      const paper = map(n1, 0, 1, -9, 8) + map(n2, 0, 1, -4, 4) + grain;

      pixels[i + 0] = constrain(pixels[i + 0] + paper, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + paper, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + paper, 0, 255);

      if (random() < 0.045) {
        const fleck = random(-18, 16);
        pixels[i + 0] = constrain(pixels[i + 0] + fleck, 0, 255);
        pixels[i + 1] = constrain(pixels[i + 1] + fleck, 0, 255);
        pixels[i + 2] = constrain(pixels[i + 2] + fleck, 0, 255);
      }
    }
  }

  updatePixels();

  noFill();

  for (let i = 0; i < 1800; i++) {
    stroke(255, random(5, 18));
    strokeWeight(random(0.4, 1.2));
    const x = random(width);
    const y = random(height);
    line(x, y, x + random(-40, 40), y + random(-2, 2));
  }

  for (let i = 0; i < 900; i++) {
    stroke(0, random(3, 12));
    strokeWeight(random(0.3, 0.8));
    const x = random(width);
    const y = random(height);
    line(x, y, x + random(-25, 25), y + random(-1.5, 1.5));
  }
}