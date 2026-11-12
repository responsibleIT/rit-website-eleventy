const COLORS = {
    burntOrange: '#E66B26',
    lightBlue: '#A9C9CF',
    darkBrown: '#3F2A24',
    mediumBrown: '#7B4C34',
    cream: '#EFDDBE',
    nearBlack: '#151515',
    background: '#F5F5F5' // Added a suiting background color
};

function setup() {
    createCanvas(1920, 1080);
    noLoop();
    noStroke();
    background(COLORS.background); // Set the background color
    drawPattern();
}

function drawPattern() {
    const blockWidth = 240; // Increased block size for a bigger design
    const blockHeight = 120; // Increased block size for a bigger design
    const cols = ceil(width / blockWidth);
    const rows = ceil(height / blockHeight);

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = col * blockWidth;
            const y = row * blockHeight;
            drawBlock(x, y, blockWidth, blockHeight, (col + row) % 2 === 0);
        }
    }
}

function drawBlock(x, y, w, h, isEven) {
    const halfW = w / 2;
    const halfH = h / 2;

    // Top face
    fill(isEven ? COLORS.burntOrange : COLORS.lightBlue);
    quad(x, y, x + halfW, y - halfH, x + w, y, x + halfW, y + halfH);

    // Left face
    fill(isEven ? COLORS.darkBrown : COLORS.mediumBrown);
    quad(x, y, x + halfW, y + halfH, x + halfW, y + h + halfH, x, y + h);

    // Right face
    fill(isEven ? COLORS.cream : COLORS.nearBlack);
    quad(x + w, y, x + halfW, y + halfH, x + halfW, y + h + halfH, x + w, y + h);
}