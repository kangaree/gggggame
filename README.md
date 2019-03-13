## Gary's Groovy Gravitating Grains Game
![GGGGGame](https://i.imgur.com/Mx3q9ZG.gif)

### Background

GGGGGame is a falling sand game. A falling sand game allows players to place particles of different elements on a "canvas". The particles can interact with other particles in various ways, and may be affected by gravity. Many versions of the falling sand game have been written since its introduction as a web-based Java applet on the Dofi-Blog in 2005.

Examples:  
https://sandspiel.club/  
https://thisissand.com/  
https://dan-ball.jp/en/javagame/dust/  

This game incorporates several of these variations, outlined in the **Functionality & MVP** and **Bonus Features** sections.  

### Functionality & MVP

With the GGGGGame, players can:

- [ ] Start, pause, and reset the game board
- [ ] Select an element to paint with (e.g., sand, water, fire)
- [ ] Click anywhere on the board and spawn selected element
- [ ] Elements interact with each other (e.g., oil lights up with fire)
- [ ] Choose from preset demo initial states

### Wireframes

This app consists of a single screen with game board, game controls, and nav links. 

Game controls are Element, Brush Size, and Start/Stop/Reset buttons.  

On the left, clickable Element buttons toggle the currently selected Element. 

On the right, there are Start/Stop/Reset buttons and Board State buttons.

![wireframes](https://i.imgur.com/J55TB1r.png)

### Architecture and Technologies

This project was implemented with the following technologies:

- `JavaScript` for game logic,
- `Canvas` with `HTML5` for effects rendering

There are three scripts in this project:

`grain.js`: elements and their properties.
`grainbox.js`: game physics.
`gggggame.js`: UI.

#### Gravity
How do we implement "falling" liquid (and "rising" gas)? 

Grains are bound by gravity:
* If there is empty space below, move down.
* If there is empty space down and to the left, move down and to the left.
* If there is empty space down and to the right, move down and to the right.

We can think of the canvas as a two dimensional array of "elements". 

The array will be looped through until every element has had gravity applied to it.

There are two complications:
* There needs to be a degree of randomness to the grains' gravity. Grains should not default to one direction.

```javascript
let dx = 0;
if (Math.random() < 0.5) {
    if (Math.random() < 0.5) {
        dx = 1;
    } else {
        dx = -1
    }
}
```

* We need to know if a grain has been updated in a frame (i.e., simulation step). Otherwise, grains can "teleport". Say a sand grain is at pos(0,0). When we first apply gravity to it, it will switch with the empty grain at pos(0,1). Then, when we loop through the second row, and for all lower rows that are empty, this grain will continue swapping with a lower position. This happens before the entire frame is finished, and when the frame is over, the sand grain hits the ground immediately. We need to skip over a grain if it has already been updated.

```javascript
// flip (ﾉ≧∇≦)ﾉ ﾐ ┸━┸
this.frameBit ^= 1;
if (this.paused) {
    this.frameBit ^= 1;
}
// If the bit was already set in the current frame skip this grain
if ((p & 1) != this.frameBit) {
    continue;
}
```

W-Shadow's Guide: https://w-shadow.com/blog/2009/09/29/falling-sand-style-water-simulation/

#### Hexadecimals and Bitwise Operators
W-Shadow suggests using a byte or char as the array element datatype, rather than a string, integer, or instance of an object. This is for size and speed.

Grains are represented as hexadecimal numbers, which corresponds to their color. This hexadecimal number needs to be converted into RGBA values when working with the canvas. 

In order to identify which grains have been updated, we flip the least significant bit of the grain every frame. This means a mask needs to be applied to certain hexadecimal numbers that do not start with a least significant bit of 0 (e.g., 0x0000ff, or blue, would be converted to 0x0000fe).

```javascript
const GrainType = {
    WATER: 0x0000ff & 0xfffffe, 
    STEAM: 0x00bfff & 0xfffffe,
};
```

JavaScript stores numbers as 64 bits floating point numbers, but all bitwise operations are performed on 32 bits binary numbers. Before a bitwise operation is performed, JavaScript converts numbers to 32 bits signed integers. After the bitwise operation is performed, the result is converted back to 64 bits JavaScript numbers.

Bitwise operators include AND, OR, XOR, NOT, zero fill left shift, and signed right shift.

```javascript
updateGrain(x, y, p) {
    const index = (y * this.width + x) * 4;
    const r = (p & 0xff0000) >> 16;
    const g = (p & 0xff00) >> 8;
    const b = (p & 0xff);

    this.data[index] = r;
    this.data[index + 1] = g;
    this.data[index + 2] = b ^ this.frameBit ^ 1;
    this.data[index + 3] = 0xff;
}
```

### Bonus features

Some anticipated updates are:

- [ ] More elements (e.g., ice, flower, fireworks)
- [ ] Save and load board states
- [ ] Different speeds
- [ ] A "person" element that can move around the sandbox