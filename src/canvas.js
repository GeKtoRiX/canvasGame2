import style from "./main.css";
import background from "./img/background.png";
import hills from "./img/hills.png";
import platform from "./img/platform.png";
import spriteStandRight from "./img/spriteStandRight.png";
import spriteStandLeft from "./img/spriteStandLeft.png";
import spriteRunRight from "./img/spriteRunRight.png";
import spriteRunLeft from "./img/spriteRunLeft.png";

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
      y: center.y - 150,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 65,
      height: 150,
    };
    this.speed = 5;
    this.img = standRight;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: standRight,
        left: standLeft,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: runRight,
        left: runLeft,
        cropWidth: 341,
        width: 127.875,
      }
    }
    this.currentSptire = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    canvas.drawImage(
      this.currentSptire,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
  update() {
    this.frames++;
    if (this.frames > 29 && this.currentSptire === this.sprites.run.right) {
      this.frames = 0;
    }
    else if (this.frames > 29 && this.currentSptire === this.sprites.run.left) {
      this.frames = 0;
    }
    else if (this.frames > 59 && this.currentSptire === this.sprites.stand.left) {
      this.frames = 0;
    }
    else if (this.frames > 59 && this.currentSptire === this.sprites.stand.right) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      this.position.y + this.size.height + this.velocity.y <
      htmlCanvas.height
    ) {
      this.velocity.y += globalGravity;
    } else {
      // this.velocity.y = 0;
    }
  }
}
class Platform {
  constructor({ x, y, img }) {
    this.position = {
      x: x,
      y: y - Math.random() * 200 - 100,
    };
    this.size = {
      width: Math.random() * 200 + 150,
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
const standRight = new Image();
standRight.src = spriteStandRight;
const standLeft = new Image();
standLeft.src = spriteStandLeft;
const runRight = new Image();
runRight.src = spriteRunRight;
const runLeft = new Image();
runLeft.src = spriteRunLeft;

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
  const getObjHillsNum = 10;
  let XGenObj = 0;
  let YGenObj = htmlCanvas.height - imgHills.height + 100;
  //
  for (let i = 0; i < getObjHillsNum; i++) {
    genericObjects.push(
      new GenericObjects({ x: XGenObj, y: YGenObj, img: imgHills })
    );
    XGenObj += imgHills.width * 2;
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
    XPlatform += 220;
  }
}
function animate() {
  requestAnimationFrame(animate);
  canvas.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  // Отрисовка окружения.
  genericObjects.forEach((object) => {
    object.draw();
  });
  // Отрисовка платформ.
  platforms.forEach((platform) => {
    platform.draw();
  });
  // Отрисовка персонажа.
  player.update();
  // Движение персонажа 300 - htmlCanvas.width / 2 и параллакс платформ и заднего фона.
  if (keys.right.pressed && player.position.x < htmlCanvas.width / 2) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 300) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((object) => {
        object.position.x -= player.speed * 0.66;
      });
      scrollOffSet += 5;
    } else if (keys.left.pressed) {
      scrollOffSet -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((object) => {
        object.position.x += player.speed * 0.66;
      });
      scrollOffSet -= 5;
    }
    // console.log(scrollOffSet);
  }
  // Определение коллизий.
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
  // Общий счет.
  if (scrollOffSet >= 4950) {
    console.log("You win!");
  }
  // Обновление игры.
  if (player.position.y > htmlCanvas.height) {
    platforms = [];
    genericObjects = [];
    scrollOffSet = 0;
    init();
    player.position.x = 100;
    player.position.y = 250;
  }
}
animate();
init();
window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      console.log("leftDown");
      keys.left.pressed = true;
      player.currentSptire = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.size.width = player.sprites.run.width;
      break;
    case "KeyD":
      console.log("rightDown");
      keys.right.pressed = true;
      player.currentSptire = player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.size.width = player.sprites.run.width;
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
      player.currentSptire = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.size.width = player.sprites.stand.width;
      break;
    case "KeyD":
      console.log("rightUp");
      keys.right.pressed = false;
      player.currentSptire = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.size.width = player.sprites.stand.width;
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
