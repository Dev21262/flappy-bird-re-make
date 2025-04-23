import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
import { shopbtn} from "./assets/shopbtn.js"
import { leaderboardbtn } from "./assets/leaderboardbtn.js";
import { grayWolf } from "./assets/grayWolf.js";
import { flappy } from "./assets/flappy.js";
import { ogFlappy } from "./assets/ogFlappy.js";
import { bg } from "./assets/bg.js";
import { menubtn } from "./assets/menubtn.js";


const width = 600;
const height = 600;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

const GRAVITY = 150; //175
const reverseArr = (array) => {
    let newArray = [];
    for (let value of array) {
        newArray.unshift(value);
    }
    
    return newArray;
};

let mouseX = 0;
let mouseY = 0;
let hoveringOn = {
    Play: false,
    Menu: false,
    Playagain: false,
    Shop: false,
    Highscore: false,

};
canvas.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - ((maxWidth / 2) - 300); 
    mouseY = event.clientY - ((maxHeight / 2) - 300); 
});

const CACHED_PIXEL_ARTS = {};
const PIXEL_ARTS = { pipe, playbtn, menubtn, leaderboardbtn, shopbtn, grayWolf, flappy, ogFlappy, bg };
PIXEL_ARTS.pipeReverse = reverseArr(PIXEL_ARTS.pipe[0]);

/**Calculate height and width of upper pipe by multiplying no of horizontal and
vertical pixels by 3(pixel size) **/    
const pipeW = (PIXEL_ARTS.pipe[0][0].length) * 3;
const pipeH = (PIXEL_ARTS.pipe[0].length) * 3;

const UP_RANDOM_Y = [-pipeH + 140, -pipeH + 290, -pipeH + 250, -pipeH + 240, -pipeH + 340, -pipeH + 280, -pipeH + 170];
const DOWN_RANDOM_Y = [height - 350, height - 200, height - 240, height - 250, height - 150, height - 210, height - 330];

function hoveringClick() {
    if (hoveringOn.Play && scene === "Menu") {
        play();
    } else if (hoveringOn.Menu && bird.dead) {
        menu();
    } else if (hoveringOn.Shop && scene === "Menu") {
        shop();
    } else if (hoveringOn.Highscore && scene === "Menu") {
        leaderboard();
    } else if (hoveringOn.Playagain && bird.dead) {
        playAgain();
    } else {

    }
}
window.addEventListener("click", hoveringClick);

class Button {
    constructor(x, y, w, h, r, color, hoverColor, art, btnName) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.color = color;
        this.hoverColor = hoverColor;
        this.art = art;
        this.btnName = btnName;
    }

    render() {
        let currentColor = undefined;
        let { x, y, w, h, r, color, hoverColor, art, btnName } = this;
        if (mouseX >= x && mouseX <= x + w &&
            mouseY >= y && mouseY <= y + h) {
            hoveringOn[btnName] = true;
            currentColor = hoverColor;
        } else {
            hoveringOn[btnName] = false;
            currentColor = color;
        }

        ctx.fillStyle = currentColor;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#292D32";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.stroke();
        render({x: art.x, y: art.y, size: art.size}, art.art, art.colorSet); 
           
    }
}


const PLAYBTN = new Button(
    100, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD", 
    {x: 165, y: 255, size: 2, art: PIXEL_ARTS.playbtn[0], colorSet: PIXEL_ARTS.playbtn[1]},
    "Play"); 
const MENUBTN = new Button(
    220, 385, 150, 60, 5,
    "#1D3A3D", "#264244", 
    {x: 280, y: 395, size: 1, art: PIXEL_ARTS.menubtn[0], colorSet: PIXEL_ARTS.menubtn[1]},
    "Menu"); 
const PLAYAGAINBTN = new Button(
    220, 315, 150, 60, 5,
    "#1D3A3D", "#264244", 
    {x: 280, y: 325, size: 1, art: PIXEL_ARTS.playbtn[0], colorSet: PIXEL_ARTS.menubtn[1]},
    "Playagain"); 
const SHOPBTN = new Button(
    205, 375, 185, 145, 5,
    "#FAFDF5", "#D1D3CD",
    {x: 265, y: 410, size: 2, art: PIXEL_ARTS.shopbtn[0], colorSet: PIXEL_ARTS.shopbtn[1]},
    "Shop");
const HIGHSCOREBTN = new Button(
    320, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD",
    {x: 370, y: 255, size: 2, art: PIXEL_ARTS.leaderboardbtn[0], colorSet: PIXEL_ARTS.leaderboardbtn[1]},
    "Highscore"); 


const prerender = (name, pixelArt, colorSet, sizeX = 2, sizeY = sizeX) => {
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
    
    CACHED_PIXEL_ARTS[name] = shadowCanvas; 
}


let score = 0;
let animX = 0;
let bestscore = 0;
let scene = "Menu";
let boxY = 700;
let animVelocity = -5;
let pipeVelocity = -5;
let birdSprite = "1";
let selectedBird = "flappy";
let upperPipesArr = [];
let lowerPipesArr = [];
let bird = {
    x: 50,
    y: 150,
    dead: false, //change
    velocity: 10, //change
    angle: Math.PI * 0,
    eventAdded: false,
    fly: function (action) {
        if (action.key === " ") {
            this.velocity = -150;
            this.angle = (-Math.PI / 50); 
            birdSprite = `2`;
        }
    },
    w: (PIXEL_ARTS[selectedBird][0][0][8].length * 3),
    h: (PIXEL_ARTS[selectedBird][0][0].length * 3),
    render: function () {
        this.velocity = this.velocity + (GRAVITY * (1 / 20)); // v = u + at updated per 2 frames
        this.y += (this.velocity * (1 / 20)) + (0.5 * GRAVITY * (1 / 20)**2); // s = ut + 1/2at^(2)

        if (this.canFly !== true) {
            this.namedFunc = (e) => this.fly(e);
            window.addEventListener("keydown", this.namedFunc);
            window.addEventListener("keyup", () => {
                window.setTimeout(() => {
                    this.angle = 0; 
                    birdSprite = `1`; 
                }, 150);
            });
           
            this.canFly = true;
        } else if (this.dead === true || this.y > height) {
            window.removeEventListener("keydown", this.namedFunc);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        cachedRender({ x: 0, y: 0 }, selectedBird + birdSprite);

        ctx.restore();
    }
}

let pipeSpam = window.setInterval(add_pipes, 1500);

prerender("pipeUpper", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1], 3);
prerender("pipeUpper2", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1], 2);
prerender("pipeLower", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1], 3);
prerender("pipeLower2", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1], 2);
prerender("flappy1", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 4);
prerender("flappy2", PIXEL_ARTS.flappy[0][1], PIXEL_ARTS.flappy[1], 4);
prerender("ogFlappy1", PIXEL_ARTS.ogFlappy[0][0], PIXEL_ARTS.ogFlappy[1], 4);
prerender("ogFlappy2", PIXEL_ARTS.ogFlappy[0][1], PIXEL_ARTS.ogFlappy[1], 4);
prerender("grayWolf1", PIXEL_ARTS.grayWolf[0][0], PIXEL_ARTS.grayWolf[1], 4);
prerender("grayWolf2", PIXEL_ARTS.grayWolf[0][1], PIXEL_ARTS.grayWolf[1], 4);
prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
prerender("bigFlappy", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 7);
  
  
function render(props, pixelArt, colorSet) {
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
const cachedRender = (props, spriteName) => ctx.drawImage(CACHED_PIXEL_ARTS[spriteName], props.x, props.y)

function add_pipes() {
    if (scene === "Play") {
        const randomIndex = Math.round(Math.random() * (UP_RANDOM_Y.length - 1));
        
        upperPipesArr.push({ x: 600, y: UP_RANDOM_Y[randomIndex] });
        lowerPipesArr.push({ x: 600, y: DOWN_RANDOM_Y[randomIndex] });
    }
}

function death() {
    // bird.velocity += 5;
    
    pipeVelocity = 0;
    animVelocity = 0;

    window.clearInterval(pipeSpam);

    if (boxY >= 130) {
        boxY -= 15;
    }
    
    if (score > bestscore) {
        bestscore = score;
    }


    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(150, boxY, 300, 350);
    
    ctx.fillStyle = "white"
    ctx.font = "0.85rem 'Press Start 2P', system-ui";
    ctx.fillText("BEST: " + bestscore, 300, boxY + 70);
    ctx.fillText("SCORE: " + score, 300, boxY + 100);

    
    render({x: 250, y: boxY + 120, size: 4}, PIXEL_ARTS[selectedBird][0][0], PIXEL_ARTS[selectedBird][1]);


    PLAYAGAINBTN.render();
    MENUBTN.render();
}

let menuLoop;
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
    ctx.textAlign = "left";
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

    cachedRender({x: 420, y: 380}, "bigFlappy");
    cachedRender({x: 520, y: 0}, "pipeUpper2");
    cachedRender({x: -10, y: 300}, "pipeLower2");
    menuLoop = requestAnimationFrame(menu);
}

function shop() {

}

function leaderboard() {
    cancelAnimationFrame(menuLoop)
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "red";
    ctx.fillRect(50, 100, 90, 90);

    requestAnimationFrame(leaderboard);
}

function playAgain() {
    score = 0;
    cancelAnimationFrame(playLoop);
    ctx.clearRect(0, 0, width, height);
    scene = "Play";

    boxY = 700
    bird.y = 150;
    bird.velocity = 0;
    bird.dead = false;
    bird.canFly = false;

    upperPipesArr = [];
    lowerPipesArr = [];
     
    animVelocity = -5;
    pipeVelocity = -5;

    pipeSpam = window.setInterval(add_pipes, 1500);
    playLoop = requestAnimationFrame(play);
}

let playLoop;

function play() {
    cancelAnimationFrame(menuLoop);
    animX += animVelocity;

    scene = "Play";
    ctx.clearRect(0, 0, width, height);
    cachedRender({ x: 0, y: 0 }, 'bg');

    for (let x = animX; x < 600; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 520);     // Start at top of left line
        ctx.lineTo(x - 5, 532);     // Bottom of left line
        ctx.lineTo(x + 5, 532);     // Top of right line
        ctx.lineTo(x + 10, 520);     // Bottom of right line
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


    for (let obj of upperPipesArr) {
        obj.x += pipeVelocity;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeUpper');
    }
    for (let obj of lowerPipesArr) {
        obj.x += pipeVelocity;
        cachedRender({ x: obj.x, y: obj.y }, 'pipeLower');
    }

    bird.render();

    for (let i = upperPipesArr.length - 1; i >= 0; i--) {
        if (upperPipesArr[i].x < -80) {
            score += 1;
            upperPipesArr.splice(i, 1);
            lowerPipesArr.splice(i, 1);
        }
    }

    if (upperPipesArr.length !== 0 && lowerPipesArr.length !== 0 && !bird.dead) {
        if  (upperPipesArr[0].x < (bird.x + bird.w) &&
            (upperPipesArr[0].x + pipeW) > bird.x &&
            (upperPipesArr[0].y + pipeH)  > (bird.y) ||

            lowerPipesArr[0].x < (bird.x + bird.w) &&
            (lowerPipesArr[0].x + pipeW) > bird.x &&
            (lowerPipesArr[0].y) < (bird.y + bird.h)) 
        {
            bird.dead = true;
        }

        if (bird.y > 600) {
            bird.dead = true;
        }
    }

    if (bird.dead) {
        death();
    }

    ctx.textAlign = "center";
    ctx.font = "2rem 'Press Start 2P', system-ui";

    
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(score, 300, 100);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    ctx.strokeText(score, 300, 100);

    playLoop = requestAnimationFrame(play);
}

// play();
menu();
