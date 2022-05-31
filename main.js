const canvas = document.getElementById("mainCanvas");
canvas.width = 200;
const laneNumber = 4;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, laneNumber);
const car = new Car(
    road.getLaneCenter(Math.floor(laneNumber / 2)),
    100,
    30,
    50
);

animate();

function animate() {
    car.update(road.borders);

    canvas.height = window.innerHeight; // Resizing the canvas also redraws/"clears" it

    ctx.save();
    ctx.translate(0, -car.posY + canvas.height * 0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}
