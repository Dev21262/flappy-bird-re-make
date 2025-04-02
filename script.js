const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

ctx.fillStyle = "#4DC2C6";
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = "#F1EBAD";
ctx.fillRect(0, height - (height / 10), width, height / 10);
console.log(ctx);