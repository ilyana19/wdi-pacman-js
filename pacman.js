// Setup initial game stats
var score = 0;
var lives = 2;
var powerPellets = 4;
var dotsRemaining = 240;
var counter = 1;

// Define your ghosts here
var inky = {
  menu_option: '1',
  name: 'Inky',
  colour: 'Red',
  character: 'Shadow',
  edible: false
}

var blinky = {
  menu_option: '2',
  name: 'Blinky',
  colour: 'Cyan',
  character: 'Speedy',
  edible: false
}

var pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
}

var clyde = {
  menu_option: '4',
  name: 'Clyde',
  colour: 'Orange',
  character: 'Pokey',
  edible: false
}

var ghosts = [inky, blinky, pinky, clyde];

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  setTimeout(function() {
    displayStats();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log('Score: ' + score + '     Lives: ' + lives);
  console.log("\n\nPower-Pellets: " + powerPellets);
  console.log("\n\nDots Remaining: " + dotsRemaining);
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line
  if (dotsRemaining > 0) {
    console.log('(a) Eat Dot');
    console.log('(b) Eat 10 Dots');
    console.log('(c) Eat 100 Dots');
    console.log('(d) Eat Remaining Dots');
  }
  if (powerPellets > 0) console.log("(p) Eat Power-Pellet");

  for(var i = 0; i < ghosts.length; i++) {
    console.log("(" + (i+1) + ") Eat " + ghosts[i].name + " (" + isEdible(ghosts[i]) + ")");
  }

  console.log('(q) Quit');
}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}

function isEdible(ghost) {
  if (ghost.edible === false) {
    return 'inedible';
  } else {
    return 'edible';
  }
}

// Menu Options
function eatDot(num) {
  var baseScore = 10; //honestly never played much of pacman so i'll assume this scoring system is correct

  switch(num) {
    case 1:
      if (dotsRemaining > 0) {
        console.log('\nChomp!');
        score += baseScore;
        dotsRemaining -= 1;
      } else {
        console.log("\nInvalid Input");
      }
      break;
    case 2:
      if (dotsRemaining >= 10) {
        console.log('\nChomp! x10');
        score += (baseScore * 10)
        dotsRemaining -= 10;
      } else {
        console.log("\nInvalid Input");
      }
      break;
    case 3:
      if (dotsRemaining >= 100) {
        console.log('\nChomp! x100');
        score += (baseScore * 100)
        dotsRemaining -= 100;
      } else {
        console.log("\nInvalid Input");
      }
      break;
    case 4:
      if (dotsRemaining > 0) {
        console.log('\nChomp! All remining dots.');
        score += (baseScore * dotsRemaining);
        dotsRemaining -= dotsRemaining;
      } else {
        console.log("\nInvalid Input");
      }
      break;
  }
}

function eatGhost(ghost) {
  if (ghosts[ghost-1]) { //select the ghost
    if (ghosts[ghost-1].edible === false) {
      lives -= 1;
      console.log("\n" + ghosts[ghost-1].name + " that has the colour " + ghosts[ghost-1].colour + " is not edible.");
      gameOver(lives);
    } else {
      ghostScores(counter)
      counter++;
      ghosts[ghost-1].edible = false;
      console.log("\nPacman just ate a " + ghosts[ghost-1].character + " " + ghosts[ghost-1].name + "!");
      console.log(counter);
    }
  }
}

function ghostScores(numGhost) {
  if (numGhost === 1) score += 200;
  else if (numGhost === 2) score += 400;
  else if (numGhost === 3) score += 800;
  else if (numGhost === 4) score += 1600;
}

function eatPowerPellet() {
  if (powerPellets > 0) {
    console.log('\nCHOMP!');
    score += 50;
    powerPellets -= 1;

    ghosts.forEach(function(ghost) {
      ghost['edible'] = true;
    });
  } else {
    console.log('\nNo more power-pellets left!');
  }
}

function gameOver(lives) {
  if (lives < 0) {
    process.exit();
  }
}

// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'a':
      eatDot(1);
      break;
    case 'b':
      eatDot(2);
      break;
    case 'c':
      eatDot(3);
      break;
    case 'd':
      eatDot(4);
      break;
    case '1':
      eatGhost(1);
      break;
    case '2':
      eatGhost(2);
      break;
    case '3':
      eatGhost(3);
      break;
    case '4':
      eatGhost(4);
      break;
    case 'p':
      eatPowerPellet();
      break;
    default:
      console.log('\nInvalid Command!');
  }
}


//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', function(key) {
  process.stdout.write(key);
  processInput(key);
  setTimeout(drawScreen, 2000); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', function() {
  console.log('\n\nGame Over!\n');
});
