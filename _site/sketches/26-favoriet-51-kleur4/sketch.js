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

  background(27, 85, 78);

  noStroke();

  // mirrored stepped mass
  fill(6, 77, 43);
  beginShape();
  vertex(X(371), Y(0));
  vertex(X(351), Y(0));
  vertex(X(351), Y(48));
  vertex(X(326), Y(48));
  vertex(X(326), Y(95));
  vertex(X(280), Y(95));
  vertex(X(280), Y(188));
  vertex(X(186), Y(188));
  vertex(X(186), Y(375));
  vertex(X(371), Y(375));
  endShape(CLOSE);

  // raised stepped blocks
  fill(126, 168, 90);
  rect(X(326), Y(24), X(24), Y(25));
  rect(X(279), Y(48), X(47), Y(47));
  rect(X(186), Y(94), X(93), Y(94));
  rect(X(0), Y(188), X(186), Y(187));

  // diagonal stair triangles / blocks
  fill(51, 58, 24);

  triangle(X(350), Y(24), X(326), Y(49), X(350), Y(49));

  beginShape();
  vertex(X(326), Y(48));
  vertex(X(279), Y(95));
  vertex(X(326), Y(95));
  endShape(CLOSE);

  beginShape();
  vertex(X(279), Y(94));
  vertex(X(186), Y(188));
  vertex(X(279), Y(188));
  endShape(CLOSE);

  beginShape();
  vertex(X(186), Y(188));
  vertex(X(0), Y(375));
  vertex(X(186), Y(375));
  endShape(CLOSE);

  // small background cuts make the flipped version feel less mechanically mirrored
  fill(27, 85, 78);
  rect(X(351), Y(50), X(10), Y(46));
  rect(X(326), Y(97), X(19), Y(92));
  rect(X(280), Y(190), X(38), Y(185));

  // thin diagonal edges
  stroke(157, 201, 211);
  strokeWeight(width * 0.00115);
  line(X(349), Y(24), X(0), Y(375));

  stroke(126, 168, 90, 150);
  strokeWeight(width * 0.0007);
  line(X(329), Y(48), X(0), Y(378));
  line(X(281), Y(95), X(2), Y(376));

  // small satellite stairs give the rigid shape a playful echo
  noStroke();

  function stairStamp(x, y, step, c1, c2, c3) {
    fill(c1);
    rect(X(x), Y(y), X(step), Y(step));
    rect(X(x - step), Y(y + step), X(step), Y(step));
    rect(X(x - step * 2), Y(y + step * 2), X(step), Y(step));

    fill(c2);
    triangle(
      X(x), Y(y),
      X(x - step), Y(y + step),
      X(x), Y(y + step)
    );
    triangle(
      X(x - step), Y(y + step),
      X(x - step * 2), Y(y + step * 2),
      X(x - step), Y(y + step * 2)
    );

    fill(c3);
    rect(X(x - step * 2), Y(y + step * 3), X(step * 2), Y(step * 0.32));
  }

  stairStamp(306, 18, 6, color(126, 168, 90), color(51, 58, 24), color(157, 201, 211));
  stairStamp(238, 66, 8, color(157, 201, 211), color(6, 77, 43), color(126, 168, 90));
  stairStamp(126, 222, 11, color(51, 58, 24), color(126, 168, 90), color(157, 201, 211));

  // punched dots and tabs break up the large blocks without changing the structure
  fill(27, 85, 78);
  circle(X(339), Y(34), X(6));
  circle(X(309), Y(72), X(8));
  circle(X(241), Y(132), X(14));
  circle(X(146), Y(276), X(19));

  fill(157, 201, 211);
  rect(X(286), Y(112), X(24), Y(4));
  rect(X(238), Y(159), X(32), Y(5));
  rect(X(64), Y(318), X(48), Y(7));

  fill(126, 168, 90, 190);
  circle(X(52), Y(66), X(11));
  circle(X(78), Y(91), X(6));
  circle(X(103), Y(119), X(9));

  stroke(157, 201, 211, 170);
  strokeWeight(width * 0.00055);
  noFill();
  rect(X(19), Y(208), X(38), Y(38));
  rect(X(58), Y(247), X(27), Y(27));
  rect(X(86), Y(275), X(18), Y(18));

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

  // subtle right-edge wear
  noStroke();
  for (let i = 0; i < 900; i++) {
    const x = random(X(353), X(371));
    const y = random(Y(115), height);
    const a = random(8, 35);
    fill(100, 110, 92, a);
    circle(x, y, random(1, 5));
  }
}
