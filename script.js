import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
import { shopbtn} from "./assets/shopbtn.js"
import { leaderboardbtn } from "./assets/leaderboardbtn.js";
import { grayWolf } from "./assets/grayWolf.js";
import { flappy } from "./assets/flappy.js";
import { bg } from "./assets/bg.js";

const canvas = document.getElementById("canvas");


const ctx = canvas.getContext("2d");

const FPS = 60;
const GRAVITY = 220;

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


function prerender(name, pixelArt, colorSet, size = 2) {
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
            } 
        }
    }
    
    cachedPIXEL_ARTS[name] = shadowCanvas; 
}

let selectedBird = "grayWolf1";

const PIXEL_ARTS = { pipe, playbtn, leaderboardbtn, shopbtn, grayWolf, flappy, bg };
PIXEL_ARTS.pipeReverse = reverseArr(PIXEL_ARTS.pipe[0]);

const cachedPIXEL_ARTS = {};

prerender("pipeUpper", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1]);
prerender("pipeLower", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1]);
prerender("flappy1", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 3);
prerender("flappy2", PIXEL_ARTS.flappy[0][1], PIXEL_ARTS.flappy[1], 3);
prerender("grayWolf1", PIXEL_ARTS.grayWolf[0][0], PIXEL_ARTS.grayWolf[1], 3);
prerender("grayWolf2", PIXEL_ARTS.grayWolf[0][1], PIXEL_ARTS.grayWolf[1], 3);

prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);

const render = (props, pixelArt, colorSet) => {
    for (let row = 0; row < pixelArt.length; row++) {
        for (let col = 0; col < pixelArt[row].length; col++) {
            const {x, y, size} = props;
            const character =  pixelArt[row][col];
            if (character !== " ") {
                ctx.fillStyle = colorSet[character];
                ctx.fillRect(x + (col * size), y + (row  * size), size, size);

            }
        }
    }
}
const cachedRender = (props, spriteName) => ctx.drawImage(cachedPIXEL_ARTS[spriteName], props.x, props.y)
const bird = {
    x: 50,
    y: 10,
    rotTheta: 0,
    velocity: 10,
    eventAdded: false,
    render: function () {
        this.velocity = this.velocity + (GRAVITY * (2 / FPS));
        this.y += (this.velocity * (2 / FPS)) + (0.5 * GRAVITY * (2 / FPS)**2);
        
        if (this.y > 500) {
            this.y = 500;
            this.velocity = 0; 
        }

        if (this.eventAdded !== true) {
            window.addEventListener("keydown", (e) => {
                if (e.key === " ") {
                    this.velocity = -250;
                    selectedBird = "grayWolf2";
                }
            });
            window.addEventListener("keyup", (e) => {
                window.setTimeout(() => {
                    selectedBird = "grayWolf1"; 
                }, 100);
            });
            this.eventAdded = true;
        }

        cachedRender({ x: this.x, y: this.y }, selectedBird);
    }
}

class Button {
    constructor(x, y, w, h, r, color, hoverColor, art) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.color = color;
        this.hoverColor = hoverColor;
        this.art = art;
    }

    render() {
        const { x, y, w, h, r, color, hoverColor, art } = this;

        canvas.addEventListener("mousemove", function(event) {
            const ex = event.clientX - ((maxWidth / 2) - 300); 
            const ey = event.clientY - ((maxHeight / 2) - 300); 
            
            ctx.fillStyle = color;
            if (ex >= x && ex <= x + w &&
                ey >= y && ey <= y + h) {
                ctx.fillStyle = hoverColor;

            } else {

            }
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#292D32";
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();
            ctx.stroke();
            render({x: art.x, y: art.y, size: art.size}, art.art, art.colorSet);
        });

    }
}
const PLAYBTN = new Button(
    100, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD", 
    {x: 165, y: 255, size: 2, art: PIXEL_ARTS.playbtn[0], colorSet: PIXEL_ARTS.playbtn[1]}) 
const SHOPBTN = new Button(
    205, 375, 185, 145, 5,
    "#FAFDF5", "#D1D3CD",
    {x: 265, y: 410, size: 2, art: PIXEL_ARTS.shopbtn[0], colorSet: PIXEL_ARTS.shopbtn[1]});
const HIGHSCOREBTN = new Button(
    320, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD",
    {x: 370, y: 255, size: 2, art: PIXEL_ARTS.leaderboardbtn[0], colorSet: PIXEL_ARTS.leaderboardbtn[1]}); 

function menu() { 
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#61DCF4");
    gradient.addColorStop(0.25, "#91DEF2");
    gradient.addColorStop(0.55, "#61DCF4");
    gradient.addColorStop(0.75, "#61DCF4");

    gradient.addColorStop(1, "#59DAF7");
    
    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    //Draw the bottom most yellow ground
    ctx.fillStyle = "#EFEDB0";
    ctx.fillRect(0, height - (height / 10), width, height / 10);

    //Use the Game's Font
    ctx.font = "2.85rem 'Press Start 2P', system-ui";
    
    //The Stroke of text
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#292D32";
    ctx.strokeText("FLAPPY", 30, 130);
    ctx.strokeText("BIRD", 30, 210);

    //The word FLAPPY in Whitish-yellow
    ctx.fillStyle = "#EFEDB2";
    ctx.fillText("FLAPPY", 30, 130);

    //The word BIRD in Light-green
    ctx.fillStyle = "#92E549";
    ctx.fillText("BIRD", 30, 210);
    
    
    //Made by 21262
    ctx.textAlign = "center";
    ctx.fillStyle = "#3F3F2F";
    ctx.font = "0.75rem 'Press Start 2P', system-ui";
    ctx.fillText("MADE BY 21262", 300, 580);

    PLAYBTN.render();
    HIGHSCOREBTN.render();
    SHOPBTN.render();

    render({x: 500, y: 0, size: 2}, PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1]);
    render({x: -10, y: 306, size: 2}, PIXEL_ARTS.pipe[0].reverse(), PIXEL_ARTS.pipe[1]);
 }

let upperRandY = [0, -50, -70, -100, -1 * (Math.random() * 30), -1 * (Math.random() * 50)];
let lowerRandY = [370, 400, 420, 450, (370 + (Math.random() * 30)), (370 + (Math.random() * 50))];
let upperPipesArr = [];
let lowerPipesArr = [];

function add_pipes() {
    window.setInterval(() => {
        upperPipesArr.push({ x: 600, y: upperRandY[Math.round(Math.random() * (upperRandY.length - 1))] });
        lowerPipesArr.push({ x: 600, y: lowerRandY[Math.round(Math.random() * (lowerRandY.length - 1))] });
    }, 1000);
}

add_pipes();

function play() {    
    ctx.clearRect(0, 0, width, height);

    // const gradient = ctx.createLinearGradient(0, 0, 0, height);
    // gradient.addColorStop(0, "#61DCF4");
    // gradient.addColorStop(0.25, "#91DEF2");
    // gradient.addColorStop(0.55, "#61DCF4");
    // gradient.addColorStop(0.75, "#61DCF4");
    // ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    cachedRender({ x: 0, y: 0 }, 'bg');


    bird.render();
    for (let obj of upperPipesArr) {
        obj.x -= 5;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeUpper');
    }
    for (let obj of lowerPipesArr) {
        obj.x -= 5;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeLower');
    }

    upperPipesArr = upperPipesArr.filter(obj => obj.x > -50);
    lowerPipesArr = lowerPipesArr.filter(obj => obj.x > -50);


    requestAnimationFrame(play);
}

play();
// menu(); 