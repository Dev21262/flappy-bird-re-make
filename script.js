import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
import { shopbtn} from "./assets/shopbtn.js"
import { leaderboardbtn } from "./assets/leaderboardbtn.js";
import { bg } from "./assets/bg.js";
import { menubtn } from "./assets/menubtn.js";
import { flappy } from "./assets/flappy.js";
import { grayWolf } from "./assets/grayWolf.js";
import { ogFlappy } from "./assets/ogFlappy.js";
import { christmasFlappy } from "./assets/christmasFlappy.js";
import { pinkFlappy } from "./assets/pinkFlappy.js";
import { brave } from "./assets/brave.js";
import { demonFlappy } from "./assets/demonFlappy.js";
import { roboFlappy } from "./assets/roboFlappy.js";
import { birdo } from "./assets/birdo.js";
import { quirky } from "./assets/quirky.js";
import { basketballFlappy } from "./assets/basketballFlappy.js";
import { tekno } from "./assets/tekno.js";
import { dominic } from "./assets/dominic.js";



const width = 600;
const height = 600;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

const GRAVITY = 140; //175
const reverseArr = (array) => {
    let newArray = [];
    for (let value of array) {
        newArray.unshift(value);
    }
    
    return newArray;
};

let mouseX = 0;
let mouseY = 0;
let selectedBird = "flappy";
let hoveringOn = {
    Play: false,
    Menu: false,
    Playagain: false,
    Shop: false,
    Highscore: false,

};
let cHoveringOn = {
    flappy: false,
    grayWolf: false,
    quirky: false,
    roboFlappy: false,
    ogFlappy: false,
    christmasFlappy: false,
    pinkFlappy: false,
    demonFlappy: false,
    brave: false,
    basketballFlappy: false,
    birdo: false,
    tekno: false,
    dominic: false
};

let scrollDirection = null;

window.addEventListener("keydown", (e) => scrollDirection = e.key);
window.addEventListener("keyup", () => scrollDirection = null);

canvas.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - ((maxWidth / 2) - 300); 
    mouseY = event.clientY - ((maxHeight / 2) - 300); 
});

document.onclick = function() {
    for (let prop in cHoveringOn) {
        if(cHoveringOn[prop]) {
            selectedBird = prop;
        } 
    }
}

let highscores = [
    {
        score: 50,
        name: "Devll",
        bird: "ogFlappy"
    },
    {
        score: 7,
        name: "MasterTa...",
        bird: "grayWolf"
    },
    {
        score: 7,
        name: "boymoos3",
        bird: "ogFlappy"
    },
    {
        score: 15,
        name: "jman",
        bird: "roboFlappy"
    },
    {
        score: 3,
        name: "Graffiti.co",
        bird: "basketballFlappy"
    },
    {
        score: 13,
        name: "21262",
        bird: "birdo"
    }, 
    {
        score: 5,
        name: "ASBackup",
        bird: "quirky"
    },
    {
        score: 46,
        name: "ephremkhsap",
        bird: "brave"
    }, 
    {
        score: 1,
        name: "saga :P",
        bird: "flappy"
    }, 
    {
        score: 18,
        name: "CodeSprite",
        bird: "dominic"
    },
    {
        score: 6,
        name: "dalegomango",
        bird: "grayWolf"
    }, 
    {
        score: 3,
        name: "digitsofpi",
        bird: "christmasFlappy"
    }, 
];

highscores = highscores.sort((a, b) => {
    return b.score - a.score;
});



const CACHED_PIXEL_ARTS = {};
const PIXEL_ARTS = { pipe, playbtn, menubtn, leaderboardbtn, shopbtn, tekno, grayWolf, roboFlappy, flappy, ogFlappy, bg, christmasFlappy, pinkFlappy, brave, demonFlappy, birdo, quirky, basketballFlappy, dominic };
PIXEL_ARTS.pipeReverse = reverseArr(PIXEL_ARTS.pipe[0]);

/**Calculate height and width of upper pipe by multiplying no of horizontal and
vertical pixels by 3(pixel size) - For future me**/    
const pipeW = (PIXEL_ARTS.pipe[0][0].length) * 3;
const pipeH = (PIXEL_ARTS.pipe[0].length) * 3;

// GAP = 120px
const UP_RANDOM_Y = [-pipeH + 340, -pipeH + 250, -pipeH + 240, -pipeH + 340, -pipeH + 270, -pipeH + 180];
const DOWN_RANDOM_Y = [height - 140, height - 230, height - 240, height - 140, height - 210, height - 300];

function hoveringClick() {
    if (hoveringOn.Play && scene === "Menu") {
        play();
    } else if (hoveringOn.Menu && scene !== "Menu") {
        if (scene !== "Play") {
            menu();
        } else if (scene === "Play" && bird.dead){
            menu();
        }
    } else if (hoveringOn.Highscore && scene === "Menu") {
        leaderboard();
    } else if (hoveringOn.Playagain && bird.dead) {
        playAgain();
    } else if (hoveringOn.Shop && scene === "Menu") {
        shop();
    } else {

    }
}

window.addEventListener("click", hoveringClick);

class Button {
    constructor(x, y, w, h, r, color, hoverColor, borderColor, art, btnName) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.color = color;
        this.hoverColor = hoverColor;
        this.borderColor = borderColor;
        this.art = art;
        this.btnName = btnName;
    }

    render() {
        let currentColor = undefined;
        let { x, y, w, h, r, color, hoverColor, borderColor, art, btnName } = this;
        if (mouseX >= x && mouseX <= x + w &&
            mouseY >= y && mouseY <= y + h && scene !== btnName) {
            hoveringOn[btnName] = true;
            currentColor = hoverColor;
        } else {
            hoveringOn[btnName] = false;
            currentColor = color;
        }

        ctx.fillStyle = currentColor;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.stroke();
        render({x: art.x, y: art.y, size: art.size}, art.art, art.colorSet); 
           
    }
}

class Character {
    constructor( art, txt, hoverColor) {
        this.art = art;
        this.txt = txt;
        this.hoverColor = hoverColor;
    }

    draw() {
        let hovring = false;
        let {art, txt, hoverColor, selectedColor } = this;
        if (mouseX >= art.x && mouseX <= art.x + 70 &&
            mouseY >= art.y && mouseY <= art.y + 70 && scene === "Shop") {
            ctx.fillStyle = hoverColor;
            cHoveringOn[art.cname] = true;
        } else {
            ctx.fillStyle = "white";
            cHoveringOn[art.cname] = false;
        }

        cachedRender({x: art.x, y: art.y}, `${art.cname}1`);

        ctx.font = "0.5rem 'Press Start 2P', system-ui";
        ctx.strokeText(txt.txt, txt.x, txt.y);
        ctx.fillText(txt.txt, txt.x, txt.y);
        
        if (txt.extxt !== undefined) {
            ctx.strokeText(txt.extxt, txt.ex, txt.ey);
            ctx.fillText(txt.extxt, txt.ex, txt.ey);
        }
           
    }
}

const cFlappy = new Character({x: 200, y: 100, cname: "flappy"}, {txt: "Flappy", x: 200, y: 182}, "#F2E33A");
const cGrayWolf = new Character({x: 200, y: 225, cname: "grayWolf"}, {txt: "Gray Wolf", x: 185, y: 305}, "#302F2D");
const cQuirky = new Character({x: 350, y: 215, cname: "quirky"}, {txt: "Quirky", x: 355, y: 305}, "#32A6A9");
const cRobo = new Character({x: 500, y: 220, cname: "roboFlappy"}, {txt: "Robo", x: 520, y: 305}, "#7EA4D0");
const cOg = new Character({x: 50, y: 100, cname: "ogFlappy"}, {txt: "OG Flappy", x: 35, y: 180}, "#F2B40D");
const cChristmas = new Character({x: 350, y: 100, cname: "christmasFlappy"}, {txt: "Chirstmas", x: 335, y: 182, extxt: "Flappy", ex: 355, ey: 200}, "#F2A816");
const cPink = new Character({x: 500, y: 100, cname: "pinkFlappy"}, {txt: "Pink", x: 515, y: 183, extxt: "Flappy", ex: 505, ey: 200}, "#E88DAC");
const cDemon = new Character({x: 50, y: 220, cname: "demonFlappy"}, {txt: "Demon", x: 60, y: 305}, "#CC4B4B");
const cBrave = new Character({x: 50, y: 350, cname: "brave"}, {txt: "Brave", x: 60, y: 425}, "#F0410D");
const cBasketball = new Character({x: 195, y: 350, cname: "basketballFlappy"}, {txt: "Basketball", x: 180, y: 428}, "#E4844E");
const cBirdo = new Character({x: 350, y: 345, cname: "birdo"}, {txt: "Birdo", x: 360, y: 427}, "#CA0D0D");
const cTekno = new Character({x: 495, y: 345, cname: "tekno"}, {txt: "Tekno", x: 510, y: 430}, "#C34C2A");
const cDominic = new Character({x: 50, y: 450, cname: "dominic"}, {txt: "Dominic", x: 52, y: 525}, "#E4844E");


const PLAYBTN = new Button(
    100, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD", "#292D32",
    {x: 165, y: 255, size: 2, art: PIXEL_ARTS.playbtn[0], colorSet: PIXEL_ARTS.playbtn[1]},
    "Play"); 
const MENUBTN = new Button(
    220, 385, 150, 60, 5,
    "#1D3A3D", "#264244", "transparent",
    {x: 280, y: 395, size: 1, art: PIXEL_ARTS.menubtn[0], colorSet: PIXEL_ARTS.menubtn[1]},
    "Menu"); 
const MENUBTN2 = new Button(
    545, 550, 60, 60, 2,
    "transparent", "transparent", "black",
    {x: 560, y: 560, size: 1, art: PIXEL_ARTS.menubtn[0], colorSet: {"g": "white"}},
    "Menu"); 
const PLAYAGAINBTN = new Button(
    220, 315, 150, 60, 5,
    "#1D3A3D", "#264244", "transparent",
    {x: 280, y: 325, size: 1, art: PIXEL_ARTS.playbtn[0], colorSet: PIXEL_ARTS.menubtn[1]},
    "Playagain"); 
const SHOPBTN = new Button(
    205, 375, 185, 145, 5,
    "#FAFDF5", "#D1D3CD", "#292D32",
    {x: 265, y: 410, size: 2, art: PIXEL_ARTS.shopbtn[0], colorSet: PIXEL_ARTS.shopbtn[1]},
    "Shop");
const HIGHSCOREBTN = new Button(
    320, 220, 185, 140, 5,
    "#FAFDF5", "#D1D3CD", "#292D32",
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

let bScore = localStorage.getItem("flappy-bestscore");

if (!bScore) {
    localStorage.setItem("flappy-bestscore", "0");
    bScore = 0;
} else {
    bScore = Number(bScore);
}

let score = 0;
let animX = 0;
let bestscore = bScore;
let scene = "Menu";
let boxY = 700;
let animVelocity = -4;
let pipeVelocity = -4;
let birdSprite = "1";

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
            this.velocity = -130;
            this.angle = (-Math.PI / 50); 
            birdSprite = `2`;
        }
    },
    get w() {
        return PIXEL_ARTS[selectedBird][0][0][0].length * 3;
    },

    get h() {
        return ((PIXEL_ARTS[selectedBird][0][0].length - 2)  * 3)
    },

    render: function () {
        this.velocity = this.velocity + (GRAVITY * (1 / 20)); // v = u + at updated per 2 frames
        this.y += (this.velocity * (1 / 20)) + (0.5 * GRAVITY * (1 / 20)**2); // s = ut + 1/2at^(2)

        if (this.canFly !== true) {
            this.namedFunc = (e) => this.fly(e);
            this.namedFunc2 = (e) => {
                if (scene === "Play") {
                    this.velocity = -130;
                    this.angle = (-Math.PI / 50); 
                    birdSprite = `2`;
                }
            }
            window.addEventListener("keydown", this.namedFunc);
            window.addEventListener("click", this.namedFunc2);
            window.addEventListener("mouseup", () => {
                window.setTimeout(() => {
                    this.angle = 0; 
                    birdSprite = `1`; 
                }, 150);
            });
            window.addEventListener("keyup", () => {
                window.setTimeout(() => {
                    this.angle = 0; 
                    birdSprite = `1`; 
                }, 150);
            });
           
            this.canFly = true;
        } else if (this.dead === true || this.y > height) {
            window.removeEventListener("keydown", this.namedFunc);
            window.removeEventListener("click", this.namedFunc2);

        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        cachedRender({ x: 0, y: 0 }, selectedBird + birdSprite);

        ctx.restore();
    }
}

let pipeSpam = window.setInterval(add_pipes, 2000);
let menuLoop;
let playLoop;
let shopLoop;
let leaderboardLoop;
function efficient() {   
    prerender("pipeUpper", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1], 3);
    prerender("pipeUpper2", PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1], 2);
    prerender("pipeLower", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1], 3);
    prerender("pipeLower2", PIXEL_ARTS.pipeReverse, PIXEL_ARTS.pipe[1], 2);
   
    prerender("pinkFlappy1", PIXEL_ARTS.pinkFlappy[0][0], PIXEL_ARTS.pinkFlappy[1], 4);
    prerender("pinkFlappy2", PIXEL_ARTS.pinkFlappy[0][1], PIXEL_ARTS.pinkFlappy[1], 4);
   
    prerender("flappy1", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 3);
    prerender("flappy2", PIXEL_ARTS.flappy[0][1], PIXEL_ARTS.flappy[1], 3);
   
    prerender("ogFlappy1", PIXEL_ARTS.ogFlappy[0][0], PIXEL_ARTS.ogFlappy[1], 4);
    prerender("ogFlappy2", PIXEL_ARTS.ogFlappy[0][1], PIXEL_ARTS.ogFlappy[1], 4);
   
    prerender("christmasFlappy1", PIXEL_ARTS.christmasFlappy[0][0], PIXEL_ARTS.christmasFlappy[1], 4);
    prerender("christmasFlappy2", PIXEL_ARTS.christmasFlappy[0][1], PIXEL_ARTS.christmasFlappy[1], 4);
    
    prerender("brave1", PIXEL_ARTS.brave[0][0], PIXEL_ARTS.brave[1], 4);
    prerender("brave2", PIXEL_ARTS.brave[0][1], PIXEL_ARTS.brave[1], 4);
    
    prerender("demonFlappy1", PIXEL_ARTS.demonFlappy[0][0], PIXEL_ARTS.demonFlappy[1], 4);
    prerender("demonFlappy2", PIXEL_ARTS.demonFlappy[0][1], PIXEL_ARTS.demonFlappy[1], 4);

    prerender("grayWolf1", PIXEL_ARTS.grayWolf[0][0], PIXEL_ARTS.grayWolf[1], 3);
    prerender("grayWolf2", PIXEL_ARTS.grayWolf[0][1], PIXEL_ARTS.grayWolf[1], 3);
   
    prerender("roboFlappy1", PIXEL_ARTS.roboFlappy[0][0], PIXEL_ARTS.roboFlappy[1], 4);
    prerender("roboFlappy2", PIXEL_ARTS.roboFlappy[0][1], PIXEL_ARTS.roboFlappy[1], 4);

    prerender("birdo1", PIXEL_ARTS.birdo[0][0], PIXEL_ARTS.birdo[1], 4);
    prerender("birdo2", PIXEL_ARTS.birdo[0][1], PIXEL_ARTS.birdo[1], 4);

    prerender("basketballFlappy1", PIXEL_ARTS.basketballFlappy[0][0], PIXEL_ARTS.basketballFlappy[1], 4);
    prerender("basketballFlappy2", PIXEL_ARTS.basketballFlappy[0][1], PIXEL_ARTS.basketballFlappy[1], 4);


    prerender("quirky1", PIXEL_ARTS.quirky[0][0], PIXEL_ARTS.quirky[1], 4);
    prerender("quirky2", PIXEL_ARTS.quirky[0][1], PIXEL_ARTS.quirky[1], 4);

    prerender("tekno1", PIXEL_ARTS.tekno[0][0], PIXEL_ARTS.tekno[1], 4);
    prerender("tekno2", PIXEL_ARTS.tekno[0][1], PIXEL_ARTS.tekno[1], 4);

    prerender("dominic1", PIXEL_ARTS.dominic[0][0], PIXEL_ARTS.dominic[1], 4);
    prerender("dominic2", PIXEL_ARTS.dominic[0][1], PIXEL_ARTS.dominic[1], 4);


    prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
    prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
    prerender("bg", PIXEL_ARTS.bg[0], PIXEL_ARTS.bg[1], 13);
    
    prerender("bigFlappy", PIXEL_ARTS.flappy[0][0], PIXEL_ARTS.flappy[1], 7);
}

efficient();
  
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
    pipeVelocity = 0;
    animVelocity = 0;

    window.clearInterval(pipeSpam);

    if (boxY >= 130) {
        boxY -= 15;
    }
    
    if (score > bestscore) {
        bestscore = score;
        localStorage.setItem("flappy-bestscore", bestscore);
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

let py = 0;
function menu() { 
    scene = "Menu";
    cancelAnimationFrame(leaderboardLoop);
    cancelAnimationFrame(playLoop);
    cancelAnimationFrame(shopLoop);

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
    cachedRender({x: 70, y: 400}, selectedBird + 1);

    menuLoop = requestAnimationFrame(menu);
}
function shop() {
    scene = "Shop";

    cancelAnimationFrame(menuLoop)
    ctx.clearRect(0, 0, width, height);
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0.2, "#32BCF9");
    gradient.addColorStop(0.4, "#5FE8FF");
    gradient.addColorStop(0.6, "#32BCF9");
    gradient.addColorStop(0.8, "#5FE8FF");
    gradient.addColorStop(1, "#32BCF9");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#0F181C";
    
    ctx.lineWidth = 3;
    ctx.textAlign= "left";
    ctx.font = "1rem 'Press Start 2P', system-ui";
    ctx.fillStyle = "white";
    ctx.strokeText("ROSTER:", 50, 60);
    ctx.fillText("ROSTER:", 50, 60);

    cFlappy.draw();
    cGrayWolf.draw();
    cQuirky.draw();
    cRobo.draw();
    cOg.draw();
    cChristmas.draw();
    cPink.draw();
    cDemon.draw();
    cBrave.draw();
    cBasketball.draw();
    cBirdo.draw();
    cTekno.draw();
    cDominic.draw();



    MENUBTN2.render();
    shopLoop = requestAnimationFrame(shop);
}
function leaderboard() {
    cancelAnimationFrame(menuLoop);

    scene = "Leaderboard"

    if (scrollDirection === "w") {
        py += 5;
    } else if (scrollDirection === "s") {
        py -= 5;
    }

    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0.2, "#69D4E8");
    gradient.addColorStop(0.4, "#69D4E8");
    gradient.addColorStop(0.6, "#69D4E8");
    gradient.addColorStop(0.8, "#40CCE5");
    gradient.addColorStop(1, "#69D4E8");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.font = "0.8rem 'Press Start 2P', system-ui";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0F181C";
    ctx.strokeText("[W/S]", 530, 30);

    ctx.font = "0.8rem 'Press Start 2P', system-ui";
    ctx.textAlign = "center";
    
    for (let i = 0; i < highscores.length; i++) {
        let iy = 70 * (i + 1); 
        ctx.fillStyle = "white";
        ctx.lineWidth = 4;
        ctx.strokeText(`#${i + 1} ${highscores[i].name} - ${highscores[i].score}`, 300, py+ iy);
        ctx.fillText(`#${i + 1} ${highscores[i].name} - ${highscores[i].score}`, 300, py + iy);
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillText(`#${i + 1} ${highscores[i].name} - ${highscores[i].score}`, 300, py + iy + 5);
        
        cachedRender({x: 30, y: py + iy - 40}, `${highscores[i].bird}1`);
    }

    MENUBTN2.render();

    leaderboardLoop = requestAnimationFrame(leaderboard);
}


function play() {
    cancelAnimationFrame(menuLoop);
    cancelAnimationFrame(shopLoop);
    cancelAnimationFrame(leaderboardLoop);
    
    ctx.fillStyle = "black";

    scene = "Play";
    
    animX += animVelocity;

    ctx.clearRect(0, 0, width, height);
    cachedRender({ x: 0, y: 0 }, 'bg');

    for (let x = animX; x < 600; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 520);     
        ctx.lineTo(x - 5, 532);    
        ctx.lineTo(x + 5, 532);    
        ctx.lineTo(x + 10, 520);  
        ctx.fillStyle = "#73BF2E";
        ctx.fill();  
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
function playAgain() {
    score = 0;
    cancelAnimationFrame(playLoop);

    ctx.clearRect(0, 0, width, height);

    boxY = 700
    bird.y = 150;
    bird.velocity = 0;
    bird.dead = false;
    bird.canFly = false;

    upperPipesArr = [];
    lowerPipesArr = [];
     
    animVelocity = -4;
    pipeVelocity = -4;

    pipeSpam = window.setInterval(add_pipes, 2000);
    playLoop = requestAnimationFrame(play);
}
menu();