import style from './main.css';

const htmlCanvas = document.getElementById('canvas');
const canvas = htmlCanvas.getContext('2d');

htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;

addEventListener('resize', () => {
    htmlCanvas.width = window.innerWidth - 4;
    htmlCanvas.height = window.innerHeight - 4;
    // init();
})
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})
const center = {
    x: htmlCanvas.width / 2,
    y: htmlCanvas.height / 2,
}
var mouse = {
    x: htmlCanvas.width / 2,
    y: htmlCanvas.height / 2,
}
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        canvas.beginPath();
        canvas.arc(center.x, center.y, this.radius, 0, Math.PI * 180, false);
        canvas.fillStyle = this.color;
        canvas.fill();
        canvas.closePath();
    }

    update() {
        this.draw();
    }
}
let particles;
function init() {
    particles = [];
    const radius = 10;
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(center.x, center.y, radius, 'blue'));
    }
}
function animate() {
    canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
    canvas.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
    particles.forEach(particle => {
        particle.update();
    });
    requestAnimationFrame(animate);
}
// init();
// animate();

