function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

const sketch26Kleur2Palette = [
  "#9fc6c8",
  "#4C131A",
  "#6F8960",
  "#6F8960",
  "#eddcae",
  "#205140",
  "#eddcae"
];

function sketch26Kleur2Color(hex, alpha = 255) {
  const c = color(hex);
  c.setAlpha(alpha);
  return c;
}

function draw() {
  const sx = width / 371;
  const sy = height / 375;

  const X = v => v * sx;
  const Y = v => v * sy;

  background(sketch26Kleur2Palette[0]);

  noStroke();

  // yellow stepped mass
  fill(sketch26Kleur2Palette[1]);
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

  // purple stepped blocks
  fill(sketch26Kleur2Palette[2]);
  rect(X(21), Y(24), X(24), Y(25));
  rect(X(45), Y(48), X(47), Y(47));
  rect(X(92), Y(94), X(93), Y(94));
  rect(X(185), Y(188), X(186), Y(187));

  //  diagonal stair triangles / blocks
  fill(sketch26Kleur2Palette[5]);

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
  stroke(sketch26Kleur2Palette[4]);
  strokeWeight(width * 0.00115);
  line(X(22), Y(24), X(371), Y(375));

  // soft printed-paper texture
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (x + y * width);
      const n = random(-18, 18);
      const speckle = random() < 0.018 ? random(-35, 35) : 0;

      pixels[i] = constrain(pixels[i] + n + speckle, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + n + speckle, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + n + speckle, 0, 255);
    }
  }
  updatePixels();

  // subtle left-edge wear
  noStroke();
  for (let i = 0; i < 900; i++) {
    const x = random(X(0), X(18));
    const y = random(Y(115), height);
    const a = random(8, 35);
    fill(sketch26Kleur2Color(sketch26Kleur2Palette[5], a));
    circle(x, y, random(1, 5));
  }
}
