const canvas = document.getElementById("mainCanvas");
canvas.width = 200;
const laneNumber = 3;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, laneNumber);
const car = new Car(
    road.getLaneCenter(Math.floor(laneNumber / 2)),
    100,
    30,
    50,
    "KEYS"
);
const traffic = [
    new Car(
        road.getLaneCenter(Math.floor(laneNumber / 2)),
        -100,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
];

animate();
console.table(traffic);
console.table([car]);

function animate() {
    car.update(road.borders, traffic);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [car]);
    }

    canvas.height = window.innerHeight; // Resizing the canvas also redraws/"clears" it

    ctx.save();
    ctx.translate(0, -car.posY + canvas.height * 0.7);

    road.draw(ctx);
    car.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }

    ctx.restore();
    requestAnimationFrame(animate);
}
