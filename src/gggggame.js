let grainSelectionString = "sand";
let grainSize = 15;
let paused = false;

window.onload = function () {

    let canvas = document.getElementById("myCanvas");

    grainbox = new Grainbox(canvas);

    penX = -1;
    penY = -1;
    oldPenX = -1;
    oldPenY = -1;
    mouseIsDown = false;

    playground3()

    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", mouseMove);

    canvas.addEventListener("touchstart", touchStart);
    canvas.addEventListener("touchmove", touchMove);

    window.requestAnimationFrame(draw);
}

function mouseDown(event) {
    let x = event.x;
    let y = event.y;

    let canvas = document.getElementById("myCanvas");

    x -= canvas.getBoundingClientRect().left;
    y -= canvas.getBoundingClientRect().top;

    penX = x;
    penY = y;

    mouseIsDown = true;
}

function mouseUp(event) {
    penX = -1;
    penY = -1;

    mouseIsDown = false;
}

function mouseMove(event) {
    let x = event.x;
    let y = event.y;

    let canvas = document.getElementById("myCanvas");

    x -= canvas.getBoundingClientRect().left;
    y -= canvas.getBoundingClientRect().top;

    penX = x;
    penY = y;
}

function getTouchPos(e) {
    if (!e)
        var e = event;

    if (e.touches) {
        if (e.touches.length == 1) { // One Finger
            const touch = e.touches[0]; // Finger One Info
            penX = touch.pageX - touch.target.offsetLeft;
            penY = touch.pageY - touch.target.offsetTop;
        }
    }
}

function touchStart(event) {
    let x = event.x;
    let y = event.y;

    let canvas = document.getElementById("myCanvas");

    x -= canvas.getBoundingClientRect().left;
    y -= canvas.getBoundingClientRect().top;

    penX = x;
    penY = y;

    mouseIsDown = true;
}

function touchMove(e) {
    getTouchPos(e);

    event.preventDefault();
}

function grainSelection(obj) {

    switch (obj.id) {
        case "empty":
            grainSelectionString = "empty";
            document.getElementById("grain-description").innerHTML = "empty (erases)";
            document.getElementById("grain-description").style.color = "#ffffff";
            break;
        case "sand":
            grainSelectionString = "sand";
            document.getElementById("grain-description").innerHTML = "sand (falls)";
            document.getElementById("grain-description").style.color = "#f4a460";
            break;
        case "wall":
            grainSelectionString = "wall";
            document.getElementById("grain-description").innerHTML = "wall (stays)";
            document.getElementById("grain-description").style.color = "#808080";
            break;
        case "fire":
            grainSelectionString = "fire";
            document.getElementById("grain-description").innerHTML = "fire (burns)";
            document.getElementById("grain-description").style.color = "#ff0000";
            break;
        case "water":
            grainSelectionString = "water";
            document.getElementById("grain-description").innerHTML = "water (falls)";
            document.getElementById("grain-description").style.color = "#0000ff";
            break;
        case "steam":
            grainSelectionString = "steam";
            document.getElementById("grain-description").innerHTML = "steam (condenses)";
            document.getElementById("grain-description").style.color = "#00bfff";
            break;
        case "oil":
            grainSelectionString = "oil";
            document.getElementById("grain-description").innerHTML = "oil (burns)";
            document.getElementById("grain-description").style.color = "#28142a";
            break;
        case "plant":
            grainSelectionString = "plant";
            document.getElementById("grain-description").innerHTML = "plant (grows)";
            document.getElementById("grain-description").style.color = "#00ff00";
            break;
        case "desert":
            grainSelectionString = "desert";
            document.getElementById("grain-description").innerHTML = "desert (sands)";
            document.getElementById("grain-description").style.color = "#ffa500";
            break;
        case "spout":
            grainSelectionString = "spout";
            document.getElementById("grain-description").innerHTML = "spout (waters)";
            document.getElementById("grain-description").style.color = "#008080";
            break;
        case "torch":
            grainSelectionString = "torch";
            document.getElementById("grain-description").innerHTML = "torch (fires)";
            document.getElementById("grain-description").style.color = "#880000";
            break;
        case "geyser":
            grainSelectionString = "geyser";
            document.getElementById("grain-description").innerHTML = "geyser (oils)";
            document.getElementById("grain-description").style.color = "#2E0850";
            break;
        case "snow":
            grainSelectionString = "snow";
            document.getElementById("grain-description").innerHTML = "snow (melts)";
            document.getElementById("grain-description").style.color = "#ffffff";
            break;
        case "acid":
            grainSelectionString = "acid";
            document.getElementById("grain-description").innerHTML = "acid (destroys)";
            document.getElementById("grain-description").style.color = "#adff2f";
            break;
    }
}

function sizeSelection(obj) {
    grainSize = obj.id;
}

function erase() {
    grainbox.erase();
    document.getElementById("grain-description").innerHTML = "BYE!";
    document.getElementById("grain-description").style.color = "#ffffff";
}

function pause() {
    grainbox.pause();
    paused = !paused;
    paused ? document.getElementById("grain-description").innerHTML = "gravity off!" : document.getElementById("grain-description").innerHTML = "groovy gravity~";
    document.getElementById("grain-description").style.color = "#ffffff";
}

function draw() {

    grainbox.update();

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    ctx.putImageData(grainbox.imageData, 0, 0);

    let penSize = grainSize;

    if (mouseIsDown) {
        let grainType = GrainType[grainSelectionString.toUpperCase()];
        grainbox.pen = grainType;
        let color = grainType.toString(16);
        while (color.length < 6) {
            // Put zeroes before if less than 6 digits (hexadecimal color value)
            color = "0" + color;
        }
        ctx.strokeStyle = "#" + color;

        ctx.lineCap = "round";
        ctx.lineWidth = penSize;
        ctx.beginPath();
        if (oldPenX == -1 && oldPenY == -1) {
            ctx.moveTo(penX, penY);
        } else {
            ctx.moveTo(oldPenX, oldPenY);
        }
        ctx.lineTo(penX, penY);
        ctx.stroke();

        grainbox.setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    // cursor
    if (penX != -1 && penY != -1) {
        let penSizeHalf = penSize / 2 | 0;
        ctx.beginPath();
        ctx.arc(penX, penY, penSize / 2, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    oldPenX = penX;
    oldPenY = penY;

    window.requestAnimationFrame(draw);
}

function setBoard(url) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    base_image = new Image();
    base_image.crossOrigin = "Anonymous"
    base_image.src = url;
    base_image.onload = function () {
        ctx.drawImage(base_image, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        grainbox.setImageData(imageData);
    }
}

function playground() {
    setBoard('https://i.imgur.com/73gHCZI.png');
}

function playground2() {
    setBoard('https://i.imgur.com/pvbjLhp.png');
}

function playground3() {
    setBoard('https://i.imgur.com/ynrcxlk.png');
}

function about() {
    setBoard('https://i.imgur.com/obHGMZW.png');
}