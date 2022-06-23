class Car {
    constructor(posX, posY, width, height, controlType, maxSpeed = 3) {
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

        if (controlType == "KEYS") {
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
        this.polygon = this.#createPolygon();
    }

    update(roadBoarders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBoarders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBoarders, traffic);
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

    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}
