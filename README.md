## JS Project Proposal: Gary's Groovy Gravity and Grain Game

### Background

GGGGGame is a falling sand game. A falling sand game is a type of particle simulation game. They allow the user to place particles of different elements on a "canvas". The particles can interact with other particles in various ways, and may be affected by gravity. Many complex effects may be achieved. Many versions of the Falling Sand Game have been written since its introduction as a web-based Java applet on the Dofi-Blog in 2005.

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

- [ ] An About modal describing the background and rules of the game
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

In addition to the entry file, there will be three scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the grains and rendering them to the DOM.

`elements.js`: this script will handle the different properties of each element- `color`, `weight`, `infect`, etc.

`state.js`: this will house several initial states, or "playgrounds".

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running. Write a basic entry file and the bare bones of all scripts outlined above. Create a basic canvas and sand element. Goals for the day:

- Drop sand and it will fall to the ground. Sand will pile up on each other.
- Make an eraser element.

**Day 2**: Pause, play, and reset buttons. Brush size buttons.

- Implement pause, play, and reset.
- Create buttons to change brush size.

**Day 3**: Create elements with different properties.

- Wall, Water, Plant, Fire, Oil, Ice, and Gas.

**Day 4**: Style the frontend, making it polished and professional.  Goals for the day:

- Create an About modal.


### Bonus features

Some anticipated updates are:

- [ ] Save and load board states
- [ ] Different speeds
- [ ] Add a "person" element that can move around the board