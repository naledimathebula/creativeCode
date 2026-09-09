// ========================================
// Canvas setup
// ========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;


// ========================================
// Word and particles
// ========================================

const word = "ALKEBULAN";
const particles = [];


// ========================================
// Mouse position
// ========================================

const mouse = {
    x: width / 2,
    y: height / 2
};


// ========================================
// Create invisible canvas
// Used to create the text
// ========================================

const offCanvas = document.createElement("canvas");
const offCtx = offCanvas.getContext("2d");

offCanvas.width = width;
offCanvas.height = height;


// ========================================
// Draw text on invisible canvas
// ========================================

offCtx.font = "bold 200px Arial";
offCtx.fillStyle = "#ffffff";
offCtx.textAlign = "center";
offCtx.textBaseline = "middle";

offCtx.fillText(
    word,
    width / 2,
    height / 2
);


// ========================================
// Get the pixels from the text
// ========================================

const data = offCtx.getImageData(
    0,
    0,
    width,
    height
).data;


// ========================================
// Create particles
// ========================================

for (let y = 0; y < height; y += 6) {

    for (let x = 0; x < width; x += 6) {

        const alpha = data[
            (y * width + x) * 4 + 3
        ];

        if (alpha > 128) {

            particles.push({
                x: x,
                y: y,

                originalX: x,
                originalY: y,

                size: 2,

                color: "#D4AF37"
            });

        }
    }
}


// ========================================
// Mouse movement
// ========================================

window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


// ========================================
// Animation
// ========================================

function animate(time) {

    // Clear the canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, width, height);


    // Loop through every particle
    particles.forEach((particle) => {

        // Distance between mouse and particle
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );


        // Mouse attraction
        const force = Math.min(
            100 / Math.max(distance * distance, 1),
            0.5
        );


        // Move particle toward its original position
        // while also reacting to the mouse

        particle.x +=
            (particle.originalX - particle.x) * 0.05
            + dx * force;

        particle.y +=
            (particle.originalY - particle.y) * 0.05
            + dy * force;


        // ========================================
        // Breathing / pulse effect
        // ========================================

        const pulse =
            Math.sin(
                time / 1000 +
                (particle.x + particle.y) / 100
            ) * 0.5 + 1;


        // ========================================
        // Draw particle
        // ========================================

        ctx.fillStyle = particle.color;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size * pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });


    // Run animation again
    requestAnimationFrame(animate);
}


// ========================================
// Start animation
// ========================================

requestAnimationFrame(animate);


// ========================================
// Resize canvas when window changes size
// ========================================

window.addEventListener("resize", () => {

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

});