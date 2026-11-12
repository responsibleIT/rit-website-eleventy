function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(7);
  background("#4E2B1C");
  noStroke();
  for (let i = 0; i < 40; i++) {
    fill(random(["#E8D7A9", "#96BDBF", "#e85a12"]));
    const x = random(width), y = random(height), s = random(80, 360);
    triangle(x, y, x + s, y, x + s / 2, y - s);
  }
}
