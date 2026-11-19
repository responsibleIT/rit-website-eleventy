const COLORS = {
    burntOrange: '#9fc6c8',
    lightBlue: '#4C131A',
    darkBrown: '#6F8960',
    mediumBrown: '#eddcae',
    cream: '#20514',
    nearBlack: '#d7c79a'
};

function setup() {
    createCanvas(1920, 1080);
    noLoop();
    noStroke();
    drawPattern();
}

function drawPattern() {
    const blockWidth = 120; // Width of each block
    const blockHeight = 60; // Height of each block
    const cols = ceil(width / blockWidth); // Number of columns
    const rows = ceil(height / blockHeight); // Number of rows

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = col * blockWidth;
            const y = row * blockHeight;
            drawBlock(x, y, blockWidth, blockHeight, (col + row) % 2 === 0);
        }
    }
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