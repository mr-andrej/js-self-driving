class Car {
    constructor(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.maxForwardSpeed = 3;
        this.maxReverseSpeed = 1.5;

        this.friction = 0.05;
        this.angle = 0;

        this.acceleration = 0.2;
        this.deceleration = 0.1;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBoarders) {
        this.#move();
        this.sensor.update();
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.deceleration;
        }

        if (this.speed > this.maxForwardSpeed) {
            this.speed = this.maxForwardSpeed;
        }

        if (this.speed < -this.maxReverseSpeed) {
            this.speed = -this.maxReverseSpeed;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Can't turn if we aren't moving
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1; // Make sures turning isn't inverted when going in reverse

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.posX -= Math.sin(this.angle) * this.speed;
        this.posY -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width / 2, // X of the car is going to be the center inside of the car
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}
