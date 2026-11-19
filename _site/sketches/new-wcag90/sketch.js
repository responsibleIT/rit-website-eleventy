// Geïnspireerd op: geometrisch boekomslagpatroon met riso-textuur
// Canvas: 1920 x 1080

const palette = {
  mint:   "#1C717E",
  wine:   "#513244",
  olive:  "#C76E3C",
  cream:  "#9fc6c8",
  pine:   "#d7c79a"
};

const tileW = 120;   // 16 tiles in de breedte (16 * 120 = 1920)
const tileH = 180;   // 6 tiles in de hoogte  (6 * 180 = 1080)

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(2);

  drawGridPattern();
  addRisoGrain();
}

// --- patroon -------------------------------------------------------

function drawGridPattern() {
  background(palette.cream);

  for (let gy = 0; gy < height; gy += tileH) {
    for (let gx = 0; gx < width; gx += tileW) {
      drawPatternTile(gx, gy);
    }
  }
}

/**
 * Tekent één tegel: ofwel een volle rechthoek,
 * of een lichte tegel met een diagonale driehoek.
 */
function drawPatternTile(x, y) {
  const colIndex = int(x / tileW);
  const rowIndex = int(y / tileH);
  const indexSum = colIndex + rowIndex;

  // Afwisseling tussen volle blokken en driehoek-tegels
  const isSolidBlock = indexSum % 2 === 0;

  if (isSolidBlock) {
    // Afwisselen tussen twee donkere kleuren voor meer riso-gevoel
    const solidColor = (colIndex % 2 === 0) ? palette.wine : palette.pine;
    noStroke();
    fill(solidColor);
    rect(x, y, tileW, tileH);
  } else {
    // Lichte tegel met schuine driehoek
    noStroke();
    fill(palette.cream);
    rect(x, y, tileW, tileH);

    // Afwisseling in richting van de diagonaal
    const useForwardDiagonal = (colIndex % 2 === 0);

    fill(palette.olive);
    if (useForwardDiagonal) {
      // diagonaal van linksonder naar rechtsboven
      triangle(
        x,         y + tileH, // linksonder
        x + tileW, y,         // rechtsboven
        x + tileW, y + tileH  // rechtsonder
      );
    } else {
      // diagonaal van linksboven naar rechtsonder
      triangle(
        x,         y,         // linksboven
        x + tileW, y + tileH, // rechtsonder
        x,         y + tileH  // linksonder
      );
    }

    // dunne rand met mintkleur voor subtiel registratiefoutje
    stroke(palette.mint + "55"); // lage alpha
    noFill();
    rect(x, y, tileW, tileH);
  }
}

// --- riso-achtige textuur (zoals in je voorbeeld) ------------------

function addRisoGrain() {
  loadPixels();

  const d = pixelDensity();
  const w = width * d;
  const h = height * d;

  // 1. basis-grain op alle pixels (per kanaal)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = 4 * (x + y * w);

      // gebruik canvas-coördinaten voor noise (dus delen door d)
      const nx = x / d;
      const ny = y / d;

      const n = noise(nx * 0.018, ny * 0.018);
      const grain = random(-18, 14) + map(n, 0, 1, -10, 10);

      pixels[i]     = constrain(pixels[i]     + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255);
      // alpha (i+3) laten we zoals hij is
    }
  }

  updatePixels();

  noStroke();

  // 2. lichte witte spikkels
  for (let i = 0; i < 32000; i++) {
    fill(255, random(5, 18));
    circle(random(width), random(height), random(0.4, 1.6));
  }

  // 3. donkere spikkels
  for (let i = 0; i < 18000; i++) {
    fill(0, random(3, 10));
    circle(random(width), random(height), random(0.35, 1.1));
  }

  // 4. zachte verticale “ink streaks” in MULTIPLY blend
  blendMode(MULTIPLY);
  for (let i = 0; i < 420; i++) {
    // bruinachtige inktkleur (zoals in voorbeeld)
    fill(70, 43, 32, random(3, 8));
    rect(random(width), random(height), random(30, 180), random(1, 4));
  }
  blendMode(BLEND);
}