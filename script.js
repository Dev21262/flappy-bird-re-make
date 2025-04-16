import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
import { shopbtn} from "./assets/shopbtn.js"
import { leaderboardbtn } from "./assets/leaderboardbtn.js";
import { grayWolf } from "./assets/grayWolf.js";
import { flappy } from "./assets/flappy.js";
import { bg } from "./assets/bg.js";

const canvas = document.getElementById("canvas");


const ctx = canvas.getContext("2d");


const width = 600;
const height = 600;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

canvas.width = width;
canvas.height = height;

const FPS = 60;
const GRAVITY = 175;
const reverseArr = (array) => {
    let newArray = [];
    for (let value of array) {
        newArray.unshift(value);
     }
    return newArray;

};
function prerender(name, pixelArt, colorSet, sizeX = 2, sizeY = sizeX) {
    const shadowCanvas = document.createElement('canvas');
    const shadowCtx = shadowCanvas.getContext('2d');

    const strLengthsArr = [];
    let rows = pixelArt.length;
    for (let strings of pixelArt) {
        strLengthsArr.push(strings.length);
    }
    let cols = Math.max(...strLengthsArr);

    shadowCanvas.width = cols * sizeX;
    shadowCanvas.height = rows * sizeY;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const character = pixelArt[row][col];
            if (character !== " " && character !== undefined) {
                shadowCtx.fillStyle = colorSet[character];
                shadowCtx.fillRect(col * sizeX, row * sizeY, sizeX, sizeY);
            } 
        }
    }
    
    cachedPIXEL_ARTS[name] = shadowCanvas; 
}

let score = 0;
let selectedBird = "grayWolf1";
const PIXEL_ARTS = { pipe, playbtn, leaderboardbtn, shopbtn, grayWolf, flappy, bg };
PIXEL_ARTS.pipeReverse = reverseArr(PIXEL_ARTS.pipe[0]);

const cachedPIXEL_ARTS = {};

prerender("pipeUpper", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1], 3);
prerender("pipeLower", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1], 3);
prerender("flappy1", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 3);
prerender("flappy2", PIXEL_ARTS.flappy[0][1], PIXEL_ARTS.flappy[1], 3);
prerender("grayWolf1", PIXEL_ARTS.grayWolf[0][0], PIXEL_ARTS.grayWolf[1], 3);
prerender("grayWolf2", PIXEL_ARTS.grayWolf[0][1], PIXEL_ARTS.grayWolf[1], 3);
prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);

/**Calculate height and width of upper pipe by mutplying no of horizotnal and
 vertical pixels by 3 **/      
const pipeW = (PIXEL_ARTS.pipe[0][0].length) * 3;
const pipeH = (PIXEL_ARTS.pipe[0].length) * 3;



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
    y: 150,
    rotTheta: 0,
    velocity: 10,
    eventAdded: false,
    h: (PIXEL_ARTS['flappy'][0][0].length * 3),
    render: function () {
        this.velocity = this.velocity + (GRAVITY * (2 / FPS));
        this.y += (this.velocity * (2 / FPS)) + (0.5 * GRAVITY * (2 / FPS)**2);


        if (this.eventAdded !== true) {
            window.addEventListener("keydown", (e) => {
                if (e.key === " ") {
                    this.velocity = -140;
                    selectedBird = "flappy2";
                }
            });
            window.addEventListener("keyup", (e) => {
                window.setTimeout(() => {
                    selectedBird = "flappy1"; 
                }, 150);
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

    ctx.lineWidth = 2;
    ctx.font = "1rem 'Press Start 2P', system-ui";
    ctx.fillStyle = "#EFEDB2";
    ctx.save();
    ctx.rotate((-10 * Math.PI) / 180);
    ctx.strokeText("REMAKE", 300, 250);
    ctx.restore();
    
    
    //Made by 21262
    ctx.textAlign = "center";
    ctx.fillStyle = "#3F3F2F";
    ctx.font = "0.75rem 'Press Start 2P', system-ui";
    ctx.fillText("MADE BY 21262", 300, 580);

    PLAYBTN.render();
    HIGHSCOREBTN.render();
    SHOPBTN.render();


    render({x: 420, y: 380, size: 7}, PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1]);

    render({x: 520, y: 0, size: 2}, PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1]);
    render({x: -10, y: 300, size: 2}, PIXEL_ARTS.pipe[0].reverse(), PIXEL_ARTS.pipe[1]);
 }

//

let upperRandY = [-pipeH + 140, -pipeH + 290, -pipeH + 250, -pipeH + 240, -pipeH + 340, -pipeH + 280, -pipeH + 170];
let lowerRandY = [height - 350, height - 200, height - 240, height - 250, height - 150, height - 210, height - 330];
let upperPipesArr = [];
let lowerPipesArr = [];

function add_pipes() {
    window.setInterval(() => {
        const randomIndex = Math.round(Math.random() * (upperRandY.length - 1));
        upperPipesArr.push({ x: 600, y: upperRandY[randomIndex] });
        lowerPipesArr.push({ x: 600, y: lowerRandY[randomIndex] });
    }, 1700);

}

add_pipes();

let patty = 0;
function play() { 
    patty -= 3;
    ctx.clearRect(0, 0, width, height);

    ctx.fillRect(0, 0, width, height);
    cachedRender({ x: 0, y: 0 }, 'bg');

    if (patty <= -25) {patty += 25};

    for (let patX = patty; patX < 600; patX += 25) {
        ctx.beginPath();
        ctx.moveTo(patX, 520);     // Start at top of left line
        ctx.lineTo(patX - 5, 532);     // Bottom of left line
        ctx.lineTo(patX + 5, 532);     // Top of right line
        ctx.lineTo(patX + 10, 520);     // Bottom of right line
        ctx.fillStyle = "#73BF2E"; // e.g., "red" or "#FF0000"
        ctx.fill();              // Fill the shape
    }
    
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#543847";
    ctx.beginPath();
    ctx.moveTo(0, 520); 
    ctx.lineTo(600, 520); 
    ctx.moveTo(0, 532);   
    ctx.lineTo(600, 532);   
    ctx.stroke();

    

    bird.render();
    for (let obj of upperPipesArr) {
        obj.x -= 4.5;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeUpper');
    }
    for (let obj of lowerPipesArr) {
        obj.x -= 4.5;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeLower');
    }

    
    
    for (let i = upperPipesArr.length - 1; i >= 0; i--) {
        if (upperPipesArr[i].x < -80) {
            score += 1;
            upperPipesArr.splice(i, 1);
            lowerPipesArr.splice(i, 1);
        }
    }

    if (upperPipesArr.length !== 0 && lowerPipesArr.length !== 0) {
        if (upperPipesArr[0].x < bird.x && (upperPipesArr[0].x + pipeW) > bird.x &&
            (upperPipesArr[0].y + pipeH)  > (bird.y)
        ) {
            score = 0;
            
        }
        if (lowerPipesArr[0].x < bird.x &&
            (lowerPipesArr[0].x + pipeW) > bird.x &&
            (lowerPipesArr[0].y) < (bird.y + bird.h)
        ) {
            score = 0;
        }    
    }


    ctx.textAlign = "center";
    ctx.font = "2rem 'Press Start 2P', system-ui";

    
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(score, 300, 100);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    ctx.strokeText(score, 300, 100);

    requestAnimationFrame(play);
}

// play();
menu(); 