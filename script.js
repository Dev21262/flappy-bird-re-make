import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
import { shopbtn} from "./assets/shopbtn.js"
import { leaderboardbtn } from "./assets/leaderboardbtn.js";

const canvas = document.getElementById("canvas");


const ctx = canvas.getContext("2d");

const fps = 60;
const width = 600;
const height = 600;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

canvas.width = width;
canvas.height = height;

const reverseArr = (array) => {
    let newArray = [];
    for (let value of array) {
        newArray.unshift(value);
     }
    return newArray;

};

const PIXEL_ARTS = { pipe, playbtn, leaderboardbtn, shopbtn };
PIXEL_ARTS.pipeReverse = reverseArr(PIXEL_ARTS.pipe[0]);
console.log(PIXEL_ARTS.pipeReverse == PIXEL_ARTS.pipe);

const spriteCache = {};

function cacheSprite(name, pixelArt, colorSet, size = 2) {
    const shadowCanvas = document.createElement('canvas');
    const shadowCtx = shadowCanvas.getContext('2d');

    const strLengthsArr = [];
    let rows = pixelArt.length;
    for (let strings of pixelArt) {
        strLengthsArr.push(strings.length);
    }
    let cols = Math.max(...strLengthsArr);

    shadowCanvas.width = cols * size;
    shadowCanvas.height = rows * size;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const character = pixelArt[row][col];
            if (character !== " " && character !== undefined) {
                shadowCtx.fillStyle = colorSet[character];
                shadowCtx.fillRect(col * size, row * size, size, size);
            } else {
            }
        }
    }
    
    spriteCache[name] = shadowCanvas; 
}

cacheSprite("pipeUpper", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1]);
cacheSprite("pipeLower", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1]);

const render = (props, spriteName) => ctx.drawImage(spriteCache[spriteName], props.x, props.y)


class Button { /* ... */ }
const PLAYBTN = new Button(/* ... */);
const SHOPBTN = new Button(/* ... */);
const HIGHSCOREBTN = new Button(/* ... */);

function menu() { /* ... */ }

let upperRandY = [0, -50, -70, -100, -1 * (Math.random() * 70), -1 * (Math.random() * 100)];
let lowerRandY = [370, 400, 420, 450];
let upperPipesArr = [];
let lowerPipesArr = [];

window.setInterval(() => {
    upperPipesArr.push({ x: 600, y: upperRandY[Math.round(Math.random() * (upperRandY.length - 1))] });
    lowerPipesArr.push({ x: 600, y: lowerRandY[Math.round(Math.random() * (lowerRandY.length - 1))] });
}, 1250);

function play() {    
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#4AC7D1");
    gradient.addColorStop(1, "#4AC7D1");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let obj of upperPipesArr) {
        obj.x -= 2.5;
        render({ x: obj.x, y: obj.y }, 'pipeUpper', PIXEL_ARTS.pipe[1]);
    }
    for (let obj of lowerPipesArr) {
        obj.x -= 2.5;
        render({ x: obj.x, y: obj.y }, 'pipeLower', PIXEL_ARTS.pipe[1]);
    }

    upperPipesArr = upperPipesArr.filter(obj => obj.x > -50);
    lowerPipesArr = lowerPipesArr.filter(obj => obj.x > -50);

    requestAnimationFrame(play);
}

play();
// menu(); // Uncomment to test menu mode