const GrainType = {
    // Hexadecimal
    EMPTY: 0x000000, 
    SAND: 0xf4a460,
    WALL: 0x808080,
    FIRE: 0xff0000,
    // Flip the last bit so it can be used as a flag for if the grain has been updated
    // This is necessary because the least significant bit is in the blue part of the hexadecimal
    WATER: 0x0000ff & 0xfffffe, 
    STEAM: 0x00bfff & 0xfffffe,
    OIL: 0x28142a,
    PLANT: 0x00ff00,

    DESERT: 0xffa500,
    SPOUT: 0x008080,
    TORCH: 0x880000,
    GEYSER: 0x2E0850,

    SNOW: 0xffffff & 0xfffffe,
    ACID: 0xadff2f & 0xfffffe,
};

class Grain {
    static isValid(p) {
        let valid = false;
        switch (p) {
            case GrainType.EMPTY:
            case GrainType.SAND:
            case GrainType.WALL:
            case GrainType.FIRE:
            case GrainType.WATER:
            case GrainType.STEAM:
            case GrainType.OIL:
            case GrainType.PLANT:
            case GrainType.DESERT:
            case GrainType.SPOUT:
            case GrainType.TORCH:
            case GrainType.GEYSER:
            case GrainType.SNOW:
            case GrainType.ACID:
                valid = true;
            default:
                break;
        }

        return valid;
    }

    static isLiquid(p) {
        let liquid = false;
        switch (p) {
            case GrainType.SAND:
            case GrainType.WATER:
            case GrainType.OIL:
            case GrainType.SNOW:
            case GrainType.ACID:
                liquid = true;
            default:
                break;
        }

        return liquid;
    }

    static isGas(p) {
        let gas = false;
        switch (p) {
            case GrainType.FIRE:
            case GrainType.STEAM:
                gas = true;
            default:
                break;
        }

        return gas;
    }

    static isActiveGenerator(p) {
        let active = false;
        switch (p) {
            case GrainType.DESERT:
            case GrainType.SPOUT:
            case GrainType.TORCH:
            case GrainType.GEYSER:
                active = true;
            default:
                break;
        }

        return active;
    }

    static getAction(p) {
        switch (p) {
            case GrainType.FIRE:
                if (Math.random() < 0.05) {
                    // Dissipate
                    return GrainType.EMPTY;
                }
                break;
            case GrainType.STEAM:
                if (Math.random() < 0.01) {
                    // Condense
                    return GrainType.WATER;
                }
                break;
            case GrainType.ACID:
                if (Math.random() < 0.03) {
                    // Dissolve / Dissipate
                    return GrainType.EMPTY;
                }
                break;
            default:
                break;
        }

        return p;
    }

    static getInteraction(p, q) {
        switch (p) {

            case GrainType.FIRE:
                switch (q) {
                    case GrainType.WATER:
                        // Boil
                        return [GrainType.FIRE, GrainType.STEAM];
                    case GrainType.OIL:
                    case GrainType.PLANT:
                        // Burn
                        return [GrainType.FIRE, GrainType.FIRE];
                    case GrainType.SNOW:
                        // Melt
                        return [GrainType.FIRE, GrainType.EMPTY];
                    default:
                        break;
                }
                break;

            case GrainType.WATER:
                switch (q) {
                    case GrainType.PLANT:
                        // Grow like a mustard seed
                        return [GrainType.PLANT, GrainType.PLANT];
                    default:
                        break;
                }
                break;

            case GrainType.DESERT:
                if (q == GrainType.EMPTY && Math.random() < 0.25) {
                    return [GrainType.DESERT, GrainType.SAND];
                }
                break;

            case GrainType.SPOUT:
                if (q == GrainType.EMPTY && Math.random() < 0.25) {
                    return [GrainType.SPOUT, GrainType.WATER];
                }
                break;

            case GrainType.TORCH:
                if (q == GrainType.EMPTY && Math.random() < 0.25) {
                    return [GrainType.TORCH, GrainType.FIRE];
                }
                break;

            case GrainType.GEYSER:
                if (q == GrainType.EMPTY && Math.random() < 0.25) {
                    return [GrainType.GEYSER, GrainType.OIL];
                }
                break;

            case GrainType.ACID:
                if (q !== GrainType.ACID) {
                    return [GrainType.ACID, GrainType.EMPTY];
                }
                break;

            default:
                break;
        }

        return [p, q];
    }
}