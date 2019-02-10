const ParticleType = {
    // Hexadecimal
    EMPTY: 0x000000, 
    SAND: 0xf4a460,
    WALL: 0x808080,
    FIRE: 0xff0000,
    // Flip the last bit so it can be used as a flag for if the particle has been updated
    // This is necessary because the least significant bit is in the blue part of the hexadecimal
    WATER: 0x0000ff & 0xfffffe, 
    STEAM: 0x00bfff & 0xfffffe,
    OIL: 0x28142a,
    PLANT: 0x00ff00,

    DESERT: 0xffa500,
    SPOUT: 0x008080,
    TORCH: 0x880000,
    GEYSER: 0x2E0850,
};

class Particle {
    static isValid(p) {
        let valid = false;
        switch (p) {
            case ParticleType.EMPTY:
            case ParticleType.SAND:
            case ParticleType.WALL:
            case ParticleType.FIRE:
            case ParticleType.WATER:
            case ParticleType.STEAM:
            case ParticleType.OIL:
            case ParticleType.PLANT:
            case ParticleType.DESERT:
            case ParticleType.SPOUT:
            case ParticleType.TORCH:
            case ParticleType.GEYSER:
                valid = true;
            default:
                break;
        }

        return valid;
    }

    static isLiquid(p) {
        let liquid = false;
        switch (p) {
            case ParticleType.SAND:
            case ParticleType.WATER:
            case ParticleType.OIL:
                liquid = true;
            default:
                break;
        }

        return liquid;
    }

    static isGas(p) {
        let gas = false;
        switch (p) {
            case ParticleType.FIRE:
            case ParticleType.STEAM:
                gas = true;
            default:
                break;
        }

        return gas;
    }

    static isActiveGenerator(p) {
        let active = false;
        switch (p) {
            case ParticleType.DESERT:
            case ParticleType.SPOUT:
            case ParticleType.TORCH:
            case ParticleType.GEYSER:
                active = true;
            default:
                break;
        }

        return active;
    }

    static getAction(p) {
        switch (p) {
            case ParticleType.FIRE:
                if (Math.random() < 0.05) {
                    // Dissipate
                    return ParticleType.EMPTY;
                }
                break;
            case ParticleType.STEAM:
                if (Math.random() < 0.01) {
                    // Condense
                    return ParticleType.WATER;
                }
            default:
                break;
        }

        return p;
    }

    static getInteraction(p, q) {
        switch (p) {

            case ParticleType.FIRE:
                switch (q) {
                    case ParticleType.WATER:
                        // Boil
                        return [ParticleType.FIRE, ParticleType.STEAM];
                    case ParticleType.OIL:
                    case ParticleType.PLANT:
                        // Burn
                        return [ParticleType.FIRE, ParticleType.FIRE];
                    default:
                        break;
                }
                break;

            case ParticleType.WATER:
                switch (q) {
                    case ParticleType.PLANT:
                        // Grow like a mustard seed
                        return [ParticleType.PLANT, ParticleType.PLANT];
                    default:
                        break;
                }
                break;

            case ParticleType.DESERT:
                if (q == ParticleType.EMPTY && Math.random() < 0.25) {
                    return [ParticleType.DESERT, ParticleType.SAND];
                }
                break;

            case ParticleType.SPOUT:
                if (q == ParticleType.EMPTY && Math.random() < 0.25) {
                    return [ParticleType.SPOUT, ParticleType.WATER];
                }
                break;

            case ParticleType.TORCH:
                if (q == ParticleType.EMPTY && Math.random() < 0.25) {
                    return [ParticleType.TORCH, ParticleType.FIRE];
                }
                break;

            case ParticleType.GEYSER:
                if (q == ParticleType.EMPTY && Math.random() < 0.25) {
                    return [ParticleType.GEYSER, ParticleType.OIL];
                }
                break;

            default:
                break;
        }

        return [p, q];
    }
}

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

        this.pen = ParticleType.EMPTY;
    }

    setImageData(imageData) {
        this.imageData = imageData;
        this.data = this.imageData.data;
    }

    getParticle(x, y) {
        const index = (y * this.width + x) * 4;

        // Get rgba values from x and y coordinates on the canvas
        const r = this.data[index];
        const g = this.data[index + 1];
        const b = this.data[index + 2];
        const a = this.data[index + 3];

        // Convert from rgba to hexadecimal
        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    setParticle(x, y, p) {
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

    updateParticle(x, y, p) {
        const index = (y * this.width + x) * 4;
        const r = (p & 0xff0000) >> 16;
        const g = (p & 0xff00) >> 8;
        const b = (p & 0xff);

        this.data[index] = r;
        this.data[index + 1] = g;

        // The frameBit flips the least significant bit of this particle (╯ರ ~ ರ）╯︵ ┻━┻
        // This particle should not be updated again until the next frame.
        this.data[index + 2] = b ^ this.frameBit ^ 1;
        this.data[index + 3] = 0xff;
    }

    update() {
        // Loop over the entire canvas array.
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let p = this.getParticle(x, y);

                if (!Particle.isValid(p & 0xfffffe)) {
                    this.updateParticle(x, y, this.pen);
                    continue;
                }

                // If the bit was already set in the current frame than skip this particle
                if ((p & 1) != this.frameBit) {
                    continue;
                }
                
                let type = p & 0xfffffe;
                // Gravity defaults to falling down
                let dy = 1;

                let activeGenerator = Particle.isActiveGenerator(type);

                if (Particle.isGas(type)) {
                    // If it is a gas, then float up
                    dy = -1;
                } else if (!Particle.isLiquid(type) && !activeGenerator) {
                    // If it is not a liquid and it is not an active generator, skip this particle.
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

                        // q is the neighboring particle
                        let q = this.getParticle(x + i, y + j);
                        if ((q & 1) != this.frameBit) {
                            // If q has already been updated in this frame, skip
                            continue;
                        }
                        let type2 = q & 0xfffffe;
                        let interaction = Particle.getInteraction(type, type2);

                        if (interaction[0] != type || interaction[1] != type2) {
                            // If the interaction did anything, finish looking at neighbors and update both particles.
                            this.updateParticle(x, y, interaction[0]);
                            this.updateParticle(x + i, y + j, interaction[1]);
                            done = true;
                        }
                    }
                }

                if (done || activeGenerator) {
                    continue;
                }

                // Perform self actions (e.g., fire dissipates)
                type = Particle.getAction(p & 0xfffffe);
                if (type != (p & 0xfffffe)) {
                    // If we performed an action (transformed) continue to next particle
                    this.updateParticle(x, y, type);
                    continue;
                }

                // Try to move down (or up if gas) (and to the left/right)
                // If there’s an empty space below the particle, move the particle down.
                // If there’s an empty space down and to the left, move the particle down and to the left.
                // If there’s an empty space down and to the right, move the particle down and to the right.

                let dx = 0;
                if (Math.random() < 0.5) {
                    // 50% chance that the particle will go straight down.

                    // Randomly pick left or right.
                    if (Math.random() < 0.5) {
                        dx = 1;
                    } else {
                        dx = -1
                    }
                }

                let q = this.getParticle(x + dx, y + dy);
                let type2 = q & 0xfffffe;

                // Maybe remove later. This is to make particles fall faster if they have two empty spaces below.
                let q2 = this.getParticle(x + dx, y + (2 * dy));
                let type22 = q2 & 0xfffffe;

                if (type22 == ParticleType.EMPTY && type2 == ParticleType.EMPTY) {
                    // If both spaces are empty, than go to the second space
                    this.updateParticle(x + dx, y + (dy * 2), type);
                    this.updateParticle(x, y, ParticleType.EMPTY);
                } else if (type2 == ParticleType.EMPTY) {
                    // Drop!
                    this.updateParticle(x + dx, y + dy, type);
                    this.updateParticle(x, y, ParticleType.EMPTY);
                }
                else if (dx != 0) {
                    // Move left or right
                    q = this.getParticle(x + dx, y);
                    type2 = q & 0xfffffe;
                    if (type2 == ParticleType.EMPTY) {
                        this.updateParticle(x + dx, y, type);
                        this.updateParticle(x, y, ParticleType.EMPTY);
                    }
                    else if (Particle.isLiquid(type2)) {
                        // Swap liquids
                        this.updateParticle(x + dx, y, type);
                        this.updateParticle(x, y, type2);
                    }
                    else if ((q & 1) != this.frameBit) {
                        // Interact
                        let interaction = Particle.getInteraction(type, type2);
                        this.updateParticle(x, y, interaction[0]);
                        this.updateParticle(x + dx, y, interaction[1]);
                    }
                    else {
                        // Nothing
                        this.updateParticle(x, y, type);
                    }
                }

                else if ((q & 1) != this.frameBit) {
                    // Interact
                    let interaction = Particle.getInteraction(type, type2);
                    this.updateParticle(x, y, interaction[0]);
                    this.updateParticle(x + dx, y + dy, interaction[1]);
                }

                else {
                    this.updateParticle(x, y, type);
                }
            }
        }

        // Clear the outer edges
        for (let x = 0; x < this.width; x++) {
            this.setParticle(x, 0, ParticleType.EMPTY);
            this.setParticle(x, this.height - 1, ParticleType.WALL);
        }
        for (let y = 0; y < this.height; y++) {
            this.setParticle(0, y, ParticleType.EMPTY);
            this.setParticle(this.width - 1, y, ParticleType.EMPTY);
        }

        // flip (ﾉ≧∇≦)ﾉ ﾐ ┸━┸
        this.frameBit ^= 1;
    }

    erase() {
        for (let i = 0; i < this.data.length; i += 4) {
            this.data[i] = 0;           // R value
            this.data[i + 1] = 0;       // G value
            this.data[i + 2] = 0;       // B value
            this.data[i + 3] = 0xff;    // A value
        }
    }
}
