import style from "./main.css";
import background from "./img/background.png";
import hills from "./img/hills.png";
import platform from "./img/platform.png";

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
// Переключатели событий true false на кнопках awd.
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
      y: center.y - 100,
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
  constructor({ x, y, img }) {
    this.position = {
      x: x,
      y: y - Math.random() * 350,
    };
    this.size = {
      width: Math.random() * 250 + 100,
      height: 100,
    };
    this.img = img;
  }
  draw() {
    canvas.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
class GenericObjects {
  constructor({ x, y, img }) {
    this.position = {
      x: x,
      y: y,
    };
    this.size = {
      width: img.width,
      height: img.height,
    };
    this.img = img;
  }
  draw() {
    canvas.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
// HTML изображения.
const imgBackground = new Image();
imgBackground.src = background;
const imgHills = new Image();
imgHills.src = hills;
const imgPlatform = new Image();
imgPlatform.src = platform;
// Игрок, Массив плфторм и статического окружения и подсчета очков прокрутки.
const player = new Player();
let platforms = [];
let genericObjects = [];
let scrollOffSet = 0;
// Создание вводных данных игры.
function init() {
  const getObjHillsNum = 3;
  let XGenObj = 0;
  let YGenObj = htmlCanvas.height - imgHills.height + 10;
  //
  for (let i = 0; i < getObjHillsNum; i++) {
    genericObjects.push(
      new GenericObjects({ x: XGenObj, y: YGenObj, img: imgHills })
    );
    XGenObj += imgHills.width;
  }
  // Вводные данные для платформ.
  const platformNum = 30;
  let XPlatform = 0;
  let YPlatform = htmlCanvas.height - 100;
  // Добавление блоков платформы. 1-100/4.
  for (let i = 0; i < platformNum; i++) {
    if (i % 2 === 0 && i > 1) {
      platforms.splice(i - 1, 1);
    } else {
      platforms.push(
        new Platform({ x: XPlatform, y: YPlatform, img: imgPlatform })
      );
    }
    XPlatform += 200;
  }
}
function animate() {
  requestAnimationFrame(animate);
  canvas.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  genericObjects.forEach((object) => {
    object.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < htmlCanvas.width / 2) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 300) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffSet += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObjects.forEach((object) => {
        object.position.x -= 3;
      });
    } else if (keys.left.pressed) {
      scrollOffSet -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      genericObjects.forEach((object) => {
        object.position.x += 3;
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
  if (scrollOffSet >= 4950) {
    console.log("You win!");
  }
}
init();
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
