import { pipe } from "./assets/pipe.js";

const PIXEL_ARTS = { pipe, };

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 600;
const height = 600;

canvas.width = width;
canvas.height = height;

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
    
    //Draw the 3 rectangles for Play, Shop and Leaderboard
    ctx.lineWidth = 2.5;
    ctx.fillStyle = "#FAFDF5";
    ctx.beginPath();
    ctx.roundRect(100, 220, 185, 140, 5);
    ctx.roundRect(320, 220, 185, 140, 5);
    ctx.roundRect(205, 375, 185, 145, 5);
    ctx.fill();
    ctx.stroke();
}

const renderAsset = (props, pixelArt, colorSet) => {
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
    //First the array --> Find the first string in array ->  first character in the string -> x = 0 y = 0 size = 10
    //First the arra --> Find the first string in array -> second character in the string -> x = 0, y = 10
}

menu();
renderAsset({x: 500, y: 0, size: 2}, PIXEL_ARTS.pipe[0], PIXEL_ARTS.pipe[1]);
renderAsset({x: -10, y: 350, size: 2}, PIXEL_ARTS.pipe[0].reverse(), PIXEL_ARTS.pipe[1]);