import { pipe } from "./assets/pipe.js";
import { playbtn } from "./assets/playbtn.js";
const PIXEL_ARTS = { pipe, playbtn };

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 600;
const height = 600;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

canvas.width = width;
canvas.height = height;

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
            }
            
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#292D32";
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();
            ctx.stroke();
            render({x: 165, y: 255, size: 2}, PIXEL_ARTS[art][0], PIXEL_ARTS[art][1]);
            

        });

    }
}

const PLAYBTN = new Button(100, 220, 185, 140, 5, "#FAFDF5", "#D1D3CD", 'playbtn') 
const SHOPBTN = new Button(205, 375, 185, 145, 5, "#FAFDF5", "#D1D3CD", 'playbtn') 
const HIGHSCOREBTN = new Button(320, 220, 185, 140, 5, "#FAFDF5", "#D1D3CD", 'playbtn') 

function menu() {
    //Clear the Canvas
    ctx.clearRect(0, 0, width, height);

    //Draw The Sky 
    ctx.fillStyle = "#4DC2C6";
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
    render({x: -10, y: 350, size: 2}, PIXEL_ARTS.pipe[0].reverse(), PIXEL_ARTS.pipe[1]);
    
    render({x: 165, y: 255, size: 2}, PIXEL_ARTS.playbtn[0], PIXEL_ARTS.playbtn[1]);

}


menu();
