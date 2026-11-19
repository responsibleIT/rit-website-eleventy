const COLORS = {
    burntOrange: '#E66B26',
    lightBlue: '#A9C9CF',
    darkBrown: '#3F2A24',
    mediumBrown: '#7B4C34',
    cream: '#EFDDBE',
    nearBlack: '#151515'
};

function setup() {
    createCanvas(1920, 1080);
    noLoop();
    noStroke();
    drawPattern();
    const btn = createButton('Download PNG');
    btn.position(10, 10);
    btn.mousePressed(() => {
      saveCanvas('15-sketch-53.js', 'png');
    });
}

function drawPattern() {
    const blockWidth = 240; // Increased width of each block
    const blockHeight = 120; // Increased height of each block
    const cols = ceil(height / blockWidth); // Adjusted for 90-degree rotation
    const rows = ceil(width / blockHeight); // Adjusted for 90-degree rotation

    push();
    translate(width / 2, height / 2); // Move origin to center
    rotate(HALF_PI); // Rotate canvas 90 degrees
    translate(-height / 2, -width / 2); // Adjust for rotation

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = col * blockWidth;
            const y = row * blockHeight;
            drawBlock(x, y, blockWidth, blockHeight, (col + row) % 2 === 0);
        }
    }

    pop();
}

function drawBlock(x, y, w, h, isEven) {
    const colors = isEven
        ? [COLORS.burntOrange, COLORS.darkBrown, COLORS.cream]
        : [COLORS.lightBlue, COLORS.mediumBrown, COLORS.nearBlack];

    // Draw left parallelogram
    fill(colors[0]);
    quad(x, y, x + w * 0.5, y - h * 0.5, x + w * 0.5, y + h * 0.5, x, y + h);

    // Draw top parallelogram
    fill(colors[1]);
    quad(x + w * 0.5, y - h * 0.5, x + w, y, x + w, y + h, x + w * 0.5, y + h * 0.5);

    // Draw right parallelogram
    fill(colors[2]);
    quad(x, y + h, x + w * 0.5, y + h * 0.5, x + w, y + h, x + w * 0.5, y + h * 1.5);
}