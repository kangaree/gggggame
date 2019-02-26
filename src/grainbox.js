class Grainbox {
    constructor(canvas) {
        const context = canvas.getContext("2d");

        this.width = canvas.width;
        this.height = canvas.height;

        this.setImageData(context.createImageData(this.width, this.height));

        for (var i = 0; i < this.data.length; i += 4) {
            this.data[i] = 0;           // R value
            this.data[i + 1] = 0;       // G value
            this.data[i + 2] = 0;       // B value
            this.data[i + 3] = 0xff;    // A value
        }

        // The frameBit is a Bit that flips every frame.
        // 0 => 1
        // flip (╯°□°）╯︵ ┻━┻ (this.frameBit ^= 1)
        // 1 => 0
        this.frameBit = 0;

        this.pen = GrainType.EMPTY;

        this.paused = false;
    }

    setImageData(imageData) {
        this.imageData = imageData;
        this.data = this.imageData.data;
    }

    getGrain(x, y) {
        const index = (y * this.width + x) * 4;

        // Get rgba values from x and y coordinates on the canvas
        const r = this.data[index];
        const g = this.data[index + 1];
        const b = this.data[index + 2];
        const a = this.data[index + 3];

        // Convert from rgba to hexadecimal
        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    setGrain(x, y, p) {
        const index = (y * this.width + x) * 4;

        // Convert from hexadecimal to rgba
        const r = (p & 0xff0000) >> 16;
        const g = (p & 0xff00) >> 8;
        const b = (p & 0xff);

        // Paint colors on canvas at the x and y index
        this.data[index] = r;
        this.data[index + 1] = g;
        // ^ is XOR, so we get the original b value without the frameBit.
        this.data[index + 2] = b ^ this.frameBit;
        this.data[index + 3] = 0xff;
    }

    updateGrain(x, y, p) {
        const index = (y * this.width + x) * 4;
        const r = (p & 0xff0000) >> 16;
        const g = (p & 0xff00) >> 8;
        const b = (p & 0xff);

        this.data[index] = r;
        this.data[index + 1] = g;

        // The frameBit flips the least significant bit of this grain (╯ರ ~ ರ）╯︵ ┻━┻
        // This grain should not be updated again until the next frame.
        this.data[index + 2] = b ^ this.frameBit ^ 1;
        this.data[index + 3] = 0xff;
    }

    update() {
        // Loop over the entire canvas array.
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let p = this.getGrain(x, y);

                if (!Grain.isValid(p & 0xfffffe)) {
                    this.updateGrain(x, y, this.pen);
                    continue;
                }

                // If the bit was already set in the current frame than skip this grain
                if ((p & 1) != this.frameBit) {
                    continue;
                }

                let type = p & 0xfffffe;
                // Gravity defaults to falling down
                let dy = 1;

                let activeGenerator = Grain.isActiveGenerator(type);

                if (Grain.isGas(type)) {
                    // If it is a gas, then float up
                    dy = -1;
                } else if (!Grain.isLiquid(type) && !activeGenerator) {
                    // If it is not a liquid and it is not an active generator, skip this grain.
                    continue;
                }

                // Interact with eight neighbors
                let done = false;
                for (let i = -1; i <= 1 && !done; i++) {
                    for (let j = -1; j <= 1 && !done; j++) {
                        if (i == 0 && j == 0) {
                            // No direction. Skip to next neighbor.
                            continue;
                        }

                        // q is the neighboring grain
                        let q = this.getGrain(x + i, y + j);
                        if ((q & 1) != this.frameBit) {
                            // If q has already been updated in this frame, skip
                            continue;
                        }
                        let type2 = q & 0xfffffe;
                        let interaction = Grain.getInteraction(type, type2);

                        if (interaction[0] != type || interaction[1] != type2) {
                            // If the interaction did anything, finish looking at neighbors and update both grains.
                            this.updateGrain(x, y, interaction[0]);
                            this.updateGrain(x + i, y + j, interaction[1]);
                            done = true;
                        }
                    }
                }

                if (done || activeGenerator) {
                    continue;
                }

                // Perform self actions (e.g., fire dissipates)
                type = Grain.getAction(p & 0xfffffe);
                if (type != (p & 0xfffffe)) {
                    // If we performed an action (transformed) continue to next grain
                    this.updateGrain(x, y, type);
                    continue;
                }

                // Try to move down (or up if gas) (and to the left/right)
                // If there’s an empty space below the grain, move the grain down.
                // If there’s an empty space down and to the left, move the grain down and to the left.
                // If there’s an empty space down and to the right, move the grain down and to the right.

                let dx = 0;
                if (Math.random() < 0.5) {
                    // 50% chance that the grain will go straight down.

                    // Randomly pick left or right.
                    if (Math.random() < 0.5) {
                        dx = 1;
                    } else {
                        dx = -1
                    }
                }

                let q = this.getGrain(x + dx, y + dy);
                let type2 = q & 0xfffffe;

                if (type2 == GrainType.EMPTY) {
                    // Drop!
                    this.updateGrain(x + dx, y + dy, type);
                    this.updateGrain(x, y, GrainType.EMPTY);
                }
                else if (dx != 0) {
                    // Move left or right
                    q = this.getGrain(x + dx, y);
                    type2 = q & 0xfffffe;
                    if (type2 == GrainType.EMPTY) {
                        this.updateGrain(x + dx, y, type);
                        this.updateGrain(x, y, GrainType.EMPTY);
                    }
                    else if (Grain.isLiquid(type2)) {
                        // Swap liquids
                        this.updateGrain(x + dx, y, type);
                        this.updateGrain(x, y, type2);
                    }
                    else if ((q & 1) != this.frameBit) {
                        // Interact
                        let interaction = Grain.getInteraction(type, type2);
                        this.updateGrain(x, y, interaction[0]);
                        this.updateGrain(x + dx, y, interaction[1]);
                    }
                    else {
                        // Nothing
                        this.updateGrain(x, y, type);
                    }
                }

                else if ((q & 1) != this.frameBit) {
                    // Interact
                    let interaction = Grain.getInteraction(type, type2);
                    this.updateGrain(x, y, interaction[0]);
                    this.updateGrain(x + dx, y + dy, interaction[1]);
                }

                else {
                    this.updateGrain(x, y, type);
                }
            }
        }

        // Clear the outer edges
        for (let x = 0; x < this.width; x++) {
            this.setGrain(x, 0, GrainType.EMPTY);
            this.setGrain(x, this.height - 1, GrainType.WALL);
        }
        for (let y = 0; y < this.height; y++) {
            this.setGrain(0, y, GrainType.EMPTY);
            this.setGrain(this.width - 1, y, GrainType.EMPTY);
        }

        // flip (ﾉ≧∇≦)ﾉ ﾐ ┸━┸
        this.frameBit ^= 1;
        if (this.paused) {
            this.frameBit ^= 1;
        }
    }

    erase() {
        for (let i = 0; i < this.data.length; i += 4) {
            this.data[i] = 0;           // R value
            this.data[i + 1] = 0;       // G value
            this.data[i + 2] = 0;       // B value
            this.data[i + 3] = 0xff;    // A value
        }
    }

    pause() {
        this.paused = !this.paused;
    }
}