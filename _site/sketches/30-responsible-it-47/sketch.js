
function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(12);
  noiseSeed(12);

  const cream = color("#efe2c8");
  const red = color(239, 55, 32, 190);
  const orange = color(255, 103, 18, 180);
  const pink = color(236, 53, 139, 175);
  const yellow = color(255, 230, 24, 195);
  const blue = color(62, 151, 220, 170);
  const green = color(103, 165, 86, 170);
  const mint = color(164, 199, 150, 155);
  const purple = color(80, 48, 153, 165);
  const brown = color(104, 58, 34, 155);

  background(cream);
  noStroke();

  const p = {
    tl: createVector(0, 0),
    tr: createVector(width, 0),
    br: createVector(width, height),
    bl: createVector(0, height),

    l1: createVector(0, height * 0.22),
    l2: createVector(0, height * 0.50),
    l3: createVector(0, height * 0.78),

    r1: createVector(width, height * 0.22),
    r2: createVector(width, height * 0.50),
    r3: createVector(width, height * 0.78),

    t1: createVector(width * 0.25, 0),
    t2: createVector(width * 0.50, 0),
    t3: createVector(width * 0.75, 0),

    b1: createVector(width * 0.25, height),
    b2: createVector(width * 0.50, height),
    b3: createVector(width * 0.75, height),

    c: createVector(width * 0.50, height * 0.50),
    c1: createVector(width * 0.39, height * 0.38),
    c2: createVector(width * 0.61, height * 0.38),
    c3: createVector(width * 0.66, height * 0.55),
    c4: createVector(width * 0.51, height * 0.68),
    c5: createVector(width * 0.35, height * 0.55),
    c6: createVector(width * 0.47, height * 0.27),
    c7: createVector(width * 0.57, height * 0.73)
  };

  function tri(a, b, c, ink, jitterX = 0, jitterY = 0) {
    fill(ink);
    triangle(
      a.x + jitterX, a.y + jitterY,
      b.x + jitterX, b.y + jitterY,
      c.x + jitterX, c.y + jitterY
    );
  }

  function quadInk(a, b, c, d, ink, jitterX = 0, jitterY = 0) {
    fill(ink);
    quad(
      a.x + jitterX, a.y + jitterY,
      b.x + jitterX, b.y + jitterY,
      c.x + jitterX, c.y + jitterY,
      d.x + jitterX, d.y + jitterY
    );
  }

  // Full-canvas triangular base layer
  tri(p.tl, p.t1, p.l1, red);
  tri(p.t1, p.t2, p.c6, yellow, -3, 2);
  tri(p.t2, p.t3, p.c6, pink, 2, -2);
  tri(p.t3, p.tr, p.r1, blue, -4, 3);

  tri(p.l1, p.t1, p.c1, blue, 3, 1);
  tri(p.t1, p.c6, p.c1, green, -2, 4);
  tri(p.c6, p.t3, p.c2, mint, 4, -2);
  tri(p.t3, p.r1, p.c2, yellow, -3, 3);

  tri(p.l1, p.c1, p.l2, purple, 2, -3);
  tri(p.c1, p.c, p.l2, brown, -4, 2);
  tri(p.c1, p.c6, p.c, green, 3, -3);
  tri(p.c6, p.c2, p.c, yellow, -2, 4);
  tri(p.c2, p.r1, p.r2, orange, 4, 2);
  tri(p.c2, p.r2, p.c, red, -3, -2);

  tri(p.l2, p.c, p.l3, pink, 3, 4);
  tri(p.l3, p.c, p.c5, blue, -2, -3);
  tri(p.c5, p.c, p.c4, yellow, 4, 1);
  tri(p.c, p.c3, p.c4, purple, -4, 3);
  tri(p.c, p.r2, p.c3, green, 2, -3);
  tri(p.c3, p.r2, p.r3, yellow, -3, 2);

  tri(p.bl, p.l3, p.b1, green);
  tri(p.l3, p.c5, p.b1, red, 2, -4);
  tri(p.b1, p.c5, p.b2, orange, -3, 3);
  tri(p.c5, p.c4, p.b2, pink, 4, -2);
  tri(p.c4, p.b3, p.b2, blue, -4, 3);
  tri(p.c4, p.r3, p.b3, yellow, 3, -3);
  tri(p.r3, p.br, p.b3, orange);

  // Wide translucent risograph registration bands
  quadInk(p.tl, p.tr, p.r1, p.l2, pink, -6, 3);
  quadInk(p.l1, p.r1, p.r2, p.l2, green, 4, -4);
  quadInk(p.l2, p.r2, p.r3, p.l3, brown, -5, 2);
  quadInk(p.l3, p.r3, p.br, p.bl, red, 3, -3);

  fill(yellow);
  quad(width * 0.02, height, width * 0.17, height, width * 0.76, 0, width * 0.66, 0);

  fill(blue);
  quad(0, height * 0.02, width * 0.11, height * 0.10, width, height * 0.89, width, height);

  fill(pink);
  quad(0, height * 0.55, width * 0.17, height * 0.50, width, height * 0.16, width, height * 0.30);

  // Central prism shards
  tri(p.c1, p.c2, p.c, yellow);
  tri(p.c2, p.c3, p.c, red);
  tri(p.c3, p.c4, p.c, purple);
  tri(p.c4, p.c5, p.c, green);
  tri(p.c5, p.c1, p.c, blue);
  tri(p.c6, p.c2, p.c, mint);
  tri(p.c5, p.c7, p.c, orange);
  tri(p.c7, p.c3, p.c, brown);

  // Registration lines
  stroke(45, 35, 45, 95);
  strokeWeight(2);
  line(0, 0, width, height);
  line(width, 0, 0, height);
  line(0, height * 0.22, width, height * 0.78);
  line(width, height * 0.22, 0, height * 0.78);
  line(0, height * 0.50, width, height * 0.50);
  line(width * 0.25, 0, width * 0.75, height);
  line(width * 0.75, 0, width * 0.25, height);

  // Risograph grain
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (x + y * width);
      const grain = noise(x * 0.035, y * 0.035) * 34 - 17;
      const fleck = random() < 0.028 ? random(-48, 32) : 0;

      pixels[i] = constrain(pixels[i] + grain + fleck, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain + fleck, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain + fleck, 0, 255);
    }
  }
  updatePixels();

  // Extra ink speckles
  noStroke();
  for (let i = 0; i < 14000; i++) {
    fill(30, random(7, 24));
    circle(random(width), random(height), random(0.8, 3.2));
  }
}