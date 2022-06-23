class Car {
    constructor(
        posX,
        posY,
        width,
        height,
        controlType,
        maxSpeed = 3,
        color = "purple"
    ) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.maxForwardSpeed = maxSpeed;
        this.maxReverseSpeed = maxSpeed / 2;
        this.friction = 0.05;
        this.angle = 0;

        this.acceleration = 0.2;
        this.deceleration = 0.1;

        this.damaged = false;

        this.useBrain = controlType == "AI";

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);
        this.img = new Image();
        this.img.src = "car.png";
        this.polygon = this.#createPolygon();

        this.mask = document.createElement("canvas");
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext("2d");
        this.img.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        };
    }

    update(roadBoarders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBoarders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBoarders, traffic);
            const offsets = this.sensor.readings.map((reading) =>
                reading == null ? 0 : 1 - reading.offset
            );

            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBoarders, traffic) {
        for (let i = 0; i < roadBoarders.length; i++) {
            if (polysIntersect(this.polygon, roadBoarders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        // Top right point
        points.push({
            x: this.posX - Math.sin(this.angle - alpha) * rad,
            y: this.posY - Math.cos(this.angle - alpha) * rad,
        });
        // Top left point
        points.push({
            x: this.posX - Math.sin(this.angle + alpha) * rad,
            y: this.posY - Math.cos(this.angle + alpha) * rad,
        });
        // Bottom right point
        points.push({
            x: this.posX - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.posY - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        // Bottom left point
        points.push({
            x: this.posX - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.posY - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
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

    draw(ctx, sensors = false) {
        if (this.sensor && sensors) {
            this.sensor.draw(ctx);
        }
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(-this.angle);
        if (!this.damaged) {
            ctx.drawImage(
                this.mask,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(
            this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.restore();
    }
}
