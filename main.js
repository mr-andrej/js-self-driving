const mainCanvas = document.getElementById("mainCanvas");
mainCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 600;
const laneNumber = 3;

const carCtx = mainCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9, laneNumber);
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = [
    new Car(
        road.getLaneCenter(Math.floor(laneNumber / 2)),
        -100,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(Math.floor(laneNumber / 2)),
        -900,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(Math.floor(0)),
        -1000,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(Math.floor(1)),
        -1000,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(Math.floor(1)),
        -500,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(Math.floor(laneNumber / 2)),
        -600,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(2),
        -500,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(2),
        -300,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
    new Car(
        road.getLaneCenter(0),
        -300,
        30,
        50,
        "DUMMY",
        1 // Any faster than 1 and the hits from the rear don't register properly for the traffic cars
    ),
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];

    for (let i = 0; i <= N; i++) {
        cars.push(
            new Car(
                road.getLaneCenter(Math.floor(laneNumber / 2)),
                100,
                30,
                50,
                "AI"
            )
        );
    }

    return cars;
}
function animate(time) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, cars);
    }

    bestCar = cars.find(
        (car) => car.posY == Math.min(...cars.map((car) => car.posY))
    );

    mainCanvas.height = window.innerHeight; // Resizing the canvas also redraws/"clears" it
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.posY + mainCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "purple");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "green", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
