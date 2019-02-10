## JS Project Proposal: Gary's Groovy Gravitating Grains Game

### Background

GGGGGame is a falling sand game. A falling sand game is a type of particle simulation game. They allow the user to place particles of different elements on a "canvas". The particles can interact with other particles in various ways, and may be affected by gravity. Many versions of the falling sand game have been written since its introduction as a web-based Java applet on the Dofi-Blog in 2005.

Examples: 
https://sandspiel.club/
https://thisissand.com/
https://dan-ball.jp/en/javagame/dust/

This simulation will incorporate several of those variations, outlined in the **Functionality & MVP** and **Bonus Features** sections.  

### Functionality & MVP  

With the GGGGGame, users will be able to:

- [ ] Start, pause, and reset the game board
- [ ] Select an element to paint with (e.g., sand, water, fire)
- [ ] Click anywhere on the board and spawn selected element
- [ ] Elements interact with each other (e.g., oil lights up with fire)
- [ ] Choose from preset demo initial states

In addition, this project will include:

- [ ] An about modal describing the background and rules (there are no rules!) of the game
- [ ] A production README

### Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github and the About modal. 

Game controls will include Start/Stop/Reset buttons and Element buttons.  

On the left, clickable Element buttons will toggle the currently selected Element. There will be clickable size buttons that will change the size of the brush.

On the right, there will be Start/Stop/Reset buttons and the link to an About modal.

![wireframes](https://i.imgur.com/J55TB1r.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for game logic,
- `Canvas` with `HTML5` for effects rendering

In addition to the entry file, there will be one script involved in this project:

`grain.js`: this script will handle elements and the sandbox logic.

#### Gravity
How do we implement "falling" sand or liquid? 

The physics can be simple- particles are bound by gravity:
* If there is empty space below, move down.
* If there is empty space down and to the left or down and to the right, move down and left or down and right.

We can think of the canvas as a two dimensional array of "elements". 

The array will be looped through until every element has had gravity applied to it.

There are two complications:
* If a particle cannot move directly down, but can move both down and to the left or down and to the right, then the particle should not default to the left, it should randomly pick between left and right.
* We need to know if a particle has been updated in a frame (i.e., simulation step). Otherwise, particles can "teleport". Say a sand particle is at pos(0,0). When we first apply gravity to it, it will switch with the empty particle at pos(0,1). Then, when we loop through the second row, and for all lower rows that are empty, it will swap to a lower position. This happens before the entire frame is finished, and when the frame is over, the sand particle hits the ground immediately. We need to skip over a particle if it has already been updated.

W-Shadow's Guide: https://w-shadow.com/blog/2009/09/29/falling-sand-style-water-simulation/

#### Hexadecimals and Bitwise Operators
W-Shadow suggests using a byte or char as the array element datatype, rather than a string or an integer. This is for size and speed.

Particles are represented as a hexadecimal number, which corresponds to its color. This hexadecimal number needs to be converted into RGB values when working with the canvas. 

In order to identify which particles have been updated, we flip the least significant bit of the particle every frame.

JavaScript stores numbers as 64 bits floating point numbers, but all bitwise operations are performed on 32 bits binary numbers. Before a bitwise operation is performed, JavaScript converts numbers to 32 bits signed integers. After the bitwise operation is performed, the result is converted back to 64 bits JavaScript numbers.

The operators are AND, OR, XOR, NOT, zero fill left shift, and signed right shift.

### Implementation Timeline

**Day 1**: Create a basic canvas element that you can draw on. Goals for the day:

- HTML/CSS Skeleton.
- Click and sand will appear. 
- Make an eraser element.

**Day 2**: Gravity. Reset button. Brush size buttons. Goals for the day:

- Drop sand and it will fall to the ground. Sand will pile up on each other.
- Create buttons to change brush size.

**Day 3**: Create elements with different properties.

- Wall, Sand, Water, Oil, Plant, and Fire.

**Day 4**: Style the frontend, making it polished and professional. Goals for the day:

- Create an About modal.

### Bonus features

Some anticipated updates are:

- [ ] Save and load board states
- [ ] Different speeds
- [ ] Add a "person" element that can move around the sandbox