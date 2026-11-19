const palette = [
  "#9fc6c8",
  "#513244",
  "#eddcae",
  "#9fc6c8",
  "#1C717E",
  "#C76E3C"
];

  // const red = "#6F8960";
  // const deepRed = "#4C131A";
  // const darkRed = "#4C131A";
  // const orange = "#205140";
  // const yellow = "#9fc6c8";
  // const brown = "#eddcae";
  // const clay = "#eddcae";


function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

function draw() {
  background(palette[0]);

  const cols = {
    rust: palette[1],
    yellow: palette[2],
    blue: palette[3],
    peach: palette[5],
    pink: palette[4]
  };

  const bands = 16;
  const bandW = width / bands;

  noStroke();

  for (let i = 0; i < bands; i++) {
    const x = i * bandW;
    const flip = i % 2 === 1;

    fill(cols.rust);
    rect(x, 0, bandW, height);

    if (!flip) {
      fill(cols.yellow);
      triangle(x + bandW, height * 0.355, x, height * 0.475, x + bandW, height * 0.595);

      fill(cols.blue);
      quad(x, height * 0.595, x, height * 0.745, x + bandW, height * 0.845, x + bandW, height * 0.695);

      fill(cols.peach);
      triangle(x, height * 0.745, x + bandW, height * 0.845, x, height * 0.945);

      fill(cols.pink);
      quad(x + bandW, height * 0.845, x + bandW, height, x, height, x, height * 0.945);
    } else {
      fill(cols.pink);
      quad(x, 0, x, height * 0.055, x + bandW, height * 0.155, x + bandW, 0);

      fill(cols.peach);
      triangle(x, height * 0.055, x + bandW, height * 0.155, x, height * 0.255);

      fill(cols.blue);
      quad(x, height * 0.255, x, height * 0.445, x + bandW, height * 0.345, x + bandW, height * 0.155);

      fill(cols.yellow);
      triangle(x, height * 0.445, x + bandW, height * 0.565, x + bandW, height * 0.345);
    }
  }

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
    fill(70, 43, 32, random(3, 8));
    rect(random(width), random(height), random(30, 180), random(1, 4));
  }
  blendMode(BLEND);
}

