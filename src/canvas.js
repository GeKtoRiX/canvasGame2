import style from "./main.css";

const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");

htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;

window.addEventListener("resize", () => {
  htmlCanvas.width = window.innerWidth - 4;
  htmlCanvas.height = window.innerHeight - 4;
  init();
});
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
const center = {
  x: htmlCanvas.width / 2,
  y: htmlCanvas.height / 2,
};
var mouse = {
  x: htmlCanvas.width / 2,
  y: htmlCanvas.height / 2,
};

const globalGravity = 0.5;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  top: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

class Player {
  constructor(x, y, width, height, color) {
    this.posRect = {
      x: x,
      y: y,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rect = {
      width: width,
      height: height,
      color: color,
    };
  }

  draw() {
    canvas.beginPath();
    canvas.fillStyle = this.rect.color;
    canvas.fillRect(
      this.posRect.x,
      this.posRect.y,
      this.rect.width,
      this.rect.height
    );
    canvas.fill();
    canvas.closePath();
  }
  update() {
    this.draw();
    this.posRect.x += this.velocity.x;
    this.posRect.y += this.velocity.y;
    if (
      this.posRect.y + this.rect.height + this.velocity.y <
      htmlCanvas.height
    ) {
      this.velocity.y += globalGravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
let player;
function init() {
  player = new Player(100, 100, 30, 30, "blue");
}
function animate() {
  canvas.fillStyle = "rgba(0, 0, 0, 0.5)";
  canvas.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  player.update();
  if (keys.right.pressed) {
    player.velocity.x = 5;
  }
  else if(keys.left.pressed){
    player.velocity.x = -5;  
  }
  else if(keys.top.pressed){
     if(player.velocity.y === 0){
        player.velocity.y = -15;
     }
  }
  requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      console.log("left");
      keys.left.pressed = true;
      break;
    case "KeyD":
      console.log("right");
      keys.right.pressed = true;
      break;
    case "KeyW":
      console.log("top");
      keys.top.pressed = true;
      break;
    case "KeyS":
      console.log("down");
      keys.down.pressed = true;
      break;
    default:
      console.log("unknown key");
      break;
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      console.log("left");
      player.velocity.x = 0;
      keys.left.pressed = false;
      break;
    case "KeyD":
      console.log("right");
      player.velocity.x = 0;
      keys.right.pressed = false;
      break;
    case "KeyW":
      console.log("top");
      player.velocity.y = 0;
      keys.top.pressed = false;
      break;
    case "KeyS":
      console.log("down");
      player.velocity.y = 0;
      keys.down.pressed = false;
      break;
    default:
      console.log("unknown key");
      break;
  }
});
