const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 600;
const height = 600;

canvas.width = 600;
canvas.height = 600;

ctx.fillStyle = "#4DC2C6";
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = "#EFEDB0";
ctx.fillRect(0, height - (height / 7), width, height / 7);

ctx.font = "3.5rem 'Press Start 2P', system-ui";

ctx.fillStyle = "#EFEDB2";
ctx.fillText("FLAPPY", 20, 150);

ctx.fillStyle = "#92E549";
ctx.fillText("BIRD", 20, 240);

ctx.lineWidth = 1.5;
ctx.fillStyle = "#FAFDF5";
ctx.strokeStyle = "#292D32";
ctx.beginPath();
ctx.roundRect(100, 250, 185, 120, 5);
ctx.roundRect(340, 250, 185, 120, 5);
ctx.roundRect(212, 385, 185, 120, 5);
ctx.fill();
ctx.stroke();