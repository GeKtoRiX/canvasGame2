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
  constructor() {
    this.position = {
      x: 50,
      y: htmlCanvas.height - 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 30,
      height: 30,
    };
    this.color = `blue`;
  }

  draw() {
    canvas.fillStyle = this.color;
    canvas.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
    canvas.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      this.position.y + this.size.height + this.velocity.y <
      htmlCanvas.height
    ) {
      this.velocity.y += globalGravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
class Platform {
  constructor({x,y}) {
    this.position = {
      x: x,
      y: y,
    };
    this.size = {
      width: 200,
      height: 20,
    };
    this.color = `red`;
  }
  draw() {
    canvas.fillStyle = this.color;
    canvas.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
const player = new Player();
const platforms = [new Platform({x: 200, y: htmlCanvas.height / 2 + 150}), new Platform({x: 200 * 3, y:htmlCanvas.height / 2})];

function init() {
  for (let i = 0; i < 3; i++) {
    platforms.push(new Platform());
  }
}
function animate() {
  requestAnimationFrame(animate);
  canvas.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  if (keys.right.pressed && player.position.x < htmlCanvas.width / 2) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }
  platforms.forEach((platform) => {
    if (
      // Сравнение высоты квадрата с поверхностью платформы.
      player.position.y + player.size.height <= platform.position.y &&
      // Сравнение высоты квадрата с поверхностью платформы с учетом ускорения.
      player.position.y + player.size.height + player.velocity.y >=
        platform.position.y &&
      // Позиция сравнения правого края квадрата с левым краем платформы.
      player.position.x + player.size.width >= platform.position.x &&
      // Позиция сравнения левого края квадрата с правым краем платформы.
      player.position.x <= platform.position.x + platform.size.width
    ) {
      player.velocity.y = 0;
    }
  });
}
animate();

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      console.log("leftDown");
      keys.left.pressed = true;
      break;
    case "KeyD":
      console.log("rightDown");
      keys.right.pressed = true;
      break;
    case "KeyW":
      console.log("topDown");
      if (player.velocity.y === 0) {
        player.velocity.y = -15;
      }
      break;
    case "KeyS":
      console.log("downDown");
      break;
    default:
      console.log("unknown key");
      break;
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      console.log("leftUp");
      keys.left.pressed = false;
      break;
    case "KeyD":
      console.log("rightUp");
      keys.right.pressed = false;
      break;
    case "KeyW":
      console.log("topUp");
      break;
    case "KeyS":
      console.log("downUp");
      break;
    default:
      console.log("unknown key");
      break;
  }
});
