const command = document.getElementById("kör-btn");
const input = document.getElementById("input-text");
const answer = document.getElementById("response");

let hpBar = document.getElementById("hp-bar");
let hpText = document.getElementById("hp-text");
let isDead = false;
var resTimer = 5;

let lowLevelCap = 11;

//DRAW THE MAP TILES
const rows = 21;
const columns = rows;
const tileHeight = 21 / columns;
const tileWidth = 20;

/* Coordinates */
let x = document.getElementById("x");
let y = document.getElementById("y");

var map = document.getElementById("map");
let createRow = function(id) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("map-row");
    row.id = id;
    map.appendChild(row);
}

let createColumn = function(id, cid) {
    var row = document.getElementById(id);
    var column = document.createElement("div");
    column.classList.add("col");
    column.classList.add("map-tile");
    column.id = cid;
    row.appendChild(column);
}

for (let x = 0; x < rows; x++) {
    createRow("row-" + x);
    map.style.width = tileWidth * x + "px";
    for (let y = 0; y < columns; y++) {
        createColumn("row-" + x, "cell-" + y);
        map.style.height = tileHeight * y + "px";
    }
}

document.getElementById("coordinates").style.top = tileWidth * rows + 15 + "px";
document.getElementById("coordinates").style.width = tileWidth * rows + "px";
document.getElementById("coordinates").style.height = "20px";
document.getElementById("coordinates").style.paddingLeft = rows * 4 + "px";
//FINISHED DRAWING THE MAP TILES

//SETUP INVENTORY UI
/*
let slotSize = 60;
let slotMargin = 25;
let inventorySlots = 5;
var inventory = document.getElementById("inventory");

for (let i = 0; i < inventorySlots; i++) {
    var slot = document.createElement("div");
    slot.classList.add("inventory-slot");
    slot.id = "slot-" + i;
    slot.style.margin = slotMargin + "px";
    slot.style.width = slotSize + "px";
    slot.style.height = slotSize + "px";
    slot.style.left = (slotSize + slotMargin) * i + "px";
    inventory.appendChild(slot);
}
*/
//FINISHED INVENTORY UI

//Boolean to check if we're engaged with an enemy.
let conflict = false;

//The character
const character = {
    attributes: {
        defense: random(2),
        stamina: 11,
        strength: 17,
        agility: 10,
        spirit: 8,
        intelligence: 8
    },
    position: {
        row: random(rows - 2),
        column: random(rows - 2)
    },
    gear: {
        helmet: "",
        shoulderpads: "",
        breastplate: "",
        belt: "",
        legs: "",
        feet: "",
        weapon: ""
    },
    name: "Adamski",
    damage: 10,
    currentHP: 0,
    maxHP: 0,
    maxExperience: 400,
    experience: 0,
    currentLevel: 1,
    backpack: {
        food: [

        ],
        armor: [

        ]
    }
}

//Character formulas
character.maxHP = Math.ceil((10 * character.attributes.stamina) + (character.maxHP * 1.5));
character.currentHP = character.maxHP;
document.getElementById("hp-text").innerHTML = character.currentHP + "/" + character.maxHP;

//Enemies
const wolf = {
    attributes: {
        stamina: random(6),
        strength: random(6),
        agility: random(6),
        intelligence: random(6),
        spirit: random(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: random(lowLevelCap),
    name: "Wolf",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

const pig = {
    attributes: {
        stamina: random(6),
        strength: random(6),
        agility: random(6),
        intelligence: random(6),
        spirit: random(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: random(lowLevelCap),
    name: "Pig",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

const spider = {
    attributes: {
        stamina: random(6),
        strength: random(6),
        agility: random(6),
        intelligence: random(6),
        spirit: random(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: random(lowLevelCap),
    name: "Spider",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

//Enemies in an array
let enemies = [
    wolf,
    pig,
    spider
];

//Enemy formulas
for (let i = 0; i < enemies.length; i++) {
    enemies[i].damage = random(3) + (enemies[i].attributes.strength / 3.5) * 1.5;
    enemies[i].maxHP = Math.ceil((10 * enemies[i].attributes.stamina) + (enemies[i].maxHP * 1.5));
    enemies[i].hp = enemies[i].maxHP;
}

/*Dynamically change colors of the enemies on the minimap,
  based on the enemies level*/
function colors(enemy) {
    let enemyColors = [
        //Level 0-2
        "#add8e6",
        //Level 3-5
        "#00FF00",
        //Level 6-8
        "#ffa500",
        //Default
        "#ff0000"
    ];

    switch (enemy.attributes.level) {
        case 0:
        case 1:
        case 2:
            return enemyColors[0];
        case 3:
        case 4:
        case 5:
            return enemyColors[1];
        case 6:
        case 7:
        case 8:
            return enemyColors[2];
        default:
            return enemyColors[3];

    }
}

//FIND PLAYER ON MAP
var updateCharacterPosition = function() {
    /* All the rows & columns to an array */
    var r = document.getElementById("row-" + character.position.row);
    var c = r.childNodes;
    /*
    Update the position every movement
    */
    c[character.position.column].style.background = "#484848";

    y.innerHTML = "Y: " + character.position.row;
    x.innerHTML = "X: " + character.position.column;
}

//FIND ENEMIES ON MAP
var updateEnemyPosition = function() {
    for (let i = 0; i < enemies.length; i++) {
        var enemyTile = getEnemyTile(enemies[i]);
        enemyTile.style.background = colors(enemies[i]);
    }
}

//Enemy wander
var enemyWander = function() {
    for (let i = 0; i < enemies.length; i++) {
        var enemyTile = getEnemyTile(enemies[i]);
        enemyTile.style.background = "#eee";
        enemyTile.innerHTML = "";
        if (enemies[i].position.row !== 0 && enemies[i].position.row !== rows - 1) {
            enemies[i].position.row += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        } else if (enemies[i].position.row == 0) {
            enemies[i].position.row += 1;
        } else if (enemies[i].position.row == rows - 1) {
            enemies[i].position.row -= 1;
        }
        if (enemies[i].position.column !== 0 && enemies[i].position.column !== columns - 1) {
            enemies[i].position.column += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        } else if (enemies[i].position.column == columns - 1) {
            enemies[i].position.column -= 1;
        } else if (enemies[i].position.column == 0) {
            enemies[i].position.column += 1;
        }
        updateEnemyPosition();
    }
}

//Reset the color if we're moving away from it.
function resetColor() {
    var r = document.getElementById("row-" + character.position.row);
    var c = r.childNodes;
    c[character.position.column].style.background = "#eee";
}

//Get enemy tile
function getEnemyTile(enemy) {
    var r = document.getElementById("row-" + enemy.position.row);
    var c = r.childNodes;
    return c[enemy.position.column];
}

//Create notifications
for (let i = 0; i < enemies.length; i++) {
    var notificationDiv = document.createElement("div");
    var notificationButton = document.createElement("button");
    var notificationText = document.createElement("p");
    var enemyDesc = document.createElement("p");
    notificationDiv.id = "notification_" + i;
    notificationDiv.className = "alert alert-dismissable alert-info";
    notificationButton.id = "notification-button_" + i;
    notificationButton.className = "close";
    notificationButton.innerHTML = "&times;";
    notificationText.id = "notification-text_" + i;
    notificationText.className = "mb-0";
    notificationText.innerHTML = "There is a " + enemies[i].attributes.name + " nearby.";
    enemyDesc.id = "enemydesc_" + i;
    enemyDesc.className = "mb-0";
    enemyDesc.innerHTML = "Level: " + enemies[i].attributes.level;
    notificationDiv.appendChild(notificationButton);
    notificationDiv.appendChild(notificationText);
    notificationDiv.appendChild(enemyDesc);
    document.getElementById("notification-col").appendChild(notificationDiv);
    document.getElementById("notification_" + i).style.position = "absolute";
    document.getElementById("notification_" + i).style.width = "200px";
    document.getElementById("notification_" + i).style.top = "-100px";
    document.getElementById("notification_" + i).style.margin = "0 auto";
}

//Enemy notifications
function enemyNotifications() {
    var enemyPositionsRow = [];
    var enemyPositionsCol = [];

    for (let i = 0; i < enemies.length; i++) {
        enemyPositionsRow.push(enemies[i].position.row);
        enemyPositionsCol.push(enemies[i].position.column);
    }

    if (closest(enemyPositionsRow, character.position.row) - character.position.row <= 2 &&
        closest(enemyPositionsCol, character.position.column) - character.position.row <= 2) {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].position.row == closest(enemyPositionsRow, character.position.row) &&
                enemies[i].position.column == closest(enemyPositionsCol, character.position.column)) {
                notificationText.innerHTML = "There is a " + enemies[i].attributes.name + " nearby.";
                enemyDesc.innerHTML = "Level: " + enemies[i].attributes.level;
                document.getElementById("notification_" + i).style.top = 1 + "px";
                document.getElementById("notification_" + i).style.opacity = 1;
                document.getElementById("notification-button_" + i).addEventListener("click", function() {
                    document.getElementById("notification_" + i).style.top = "-100px";
                });
                setTimeout(function() {
                    document.getElementById("notification_" + i).style.opacity = 0;
                    document.getElementById("notification_" + i).style.top = "-100px";
                }, 2000);
            }
        }
    }

    function closest(array, number) {
        var current = array[0];
        var difference = Math.abs(number - current);
        var index = array.length;
        while (index--) {
            var newDifference = Math.abs(number - array[index]);
            if (newDifference < difference) {
                difference = newDifference;
                current = array[index];
            }
        }
        return current;
    };
}


//Initializing the positions on the map

updateEnemyPosition();
updateCharacterPosition();

//Check for conflict
window.setInterval(function() {
    if (conflict) {
        $(".character-screen").removeClass("d-none");
    }
}, 100);

//Key movement
//Hide character screen
$(document).keydown(function(e) {
    //Eat function
    if (e.keyCode == 82) {
        for (let i = 0; i < character.backpack.food.length; i++) {
            if (character.backpack.food[i].saturation > 0) {
                character.backpack.food[i].eat();
            } else {
                character.backpack.food.splice(i, 1);
            }
        }
    }

    //Game mechanics
    if (!conflict) {
        if (!isDead) {
            enemyNotifications();
        }
        resetColor();
        if (random(6) == 2) {
            enemyWander();
        }
        if (e.keyCode == 27) {
            if ($(".character-screen").hasClass("d-none")) {
                $(".character-screen").removeClass("d-none");
            } else {
                $(".character-screen").addClass("d-none");
            }
        }
        //Movement handler
        switch (e.keyCode) {
            //UP
            case 87:
                if (character.position.row !== 0) {
                    move(-1, 0);
                }
                break;
                //DOWN
            case 83:
                if (character.position.row !== rows - 1) {
                    move(1, 0);
                }
                break;
                //LEFT
            case 65:
                if (character.position.column !== 0) {
                    move(0, -1);
                }
                break;
                //RIGHT
            case 68:
                if (character.position.column !== rows - 1) {
                    move(0, 1);
                }
                break;
        }
        if (!isDead) {
            checkEnemyPositions();
        }
        updateCharacterPosition();
    }
});

//Small function to return a boolean if the word we enter matches our target word.
function checkWordMatch(word, matchning) {
    return word == matchning;
}

/*Update the row & column positions in the character object.
  Which are the variables in which the map updates from.*/
function move(goX, goY) {
    character.position.row += goX;
    character.position.column += goY;
}

//Function to check if we've engaged with an enemy, also to handle the engaging part.
function checkEnemyPositions() {
    for (let i = 0; i < enemies.length; i++) {
        if (JSON.stringify(character.position.row) == JSON.stringify(enemies[i].position.row) &&
            JSON.stringify(character.position.column) == JSON.stringify(enemies[i].position.column)) {
            conflict = true;
            answer.innerHTML = "There's an enemy at this position, what do you wish to do?";
            document.getElementById("fly").classList.remove("d-none");
            document.getElementById("slåss").classList.remove("d-none");

            document.getElementById("fly").onclick = function() {
                conflict = false;
                answer.innerHTML = "You fled from the enemy.";
                document.getElementById("fly").classList.add("d-none");
                document.getElementById("slåss").classList.add("d-none");
            }

            document.getElementById("slåss").onclick = function() {
                document.getElementById("enemy-div").classList.remove("d-none");
                document.getElementById("map").classList.add("d-none");
                document.getElementById("enemy-hp-text").innerHTML = enemies[i].hp + "/" + enemies[i].maxHP;
                document.getElementById("enemy-info").innerHTML = enemies[i].name + ", Level " + enemies[i].level;
                answer.innerHTML = "You've engaged in battle with " + enemies[i].name;
                document.getElementById("fly").classList.add("d-none");
                document.getElementById("slåss").classList.add("d-none");
                document.getElementById("attackera-btn").classList.remove("d-none");
                document.getElementById("skydda-btn").classList.remove("d-none");
                fight(enemies[i]);
            }
        }

        function fight(enemy) {
            setInterval(function() {
                if (enemy.hp < 1) {
                    winBattle(enemy);

                }
                if (character.currentHP < 1) {
                    characterDeath();
                }
            }, 100);
            document.getElementById("attackera-btn").onclick = function() {
                if (enemy.hp > 0) {
                    enemy.hp -= random(character.damage);
                    document.getElementById("enemy-hp-text").innerHTML = enemy.hp + "/" + enemy.maxHP;
                    character.currentHP -= random(enemy.damage);
                    setCharacterHP(character.currentHP);
                }
            }
            document.getElementById("skydda-btn").onclick = function() {}
        }
    }
}

function winBattle(enemy) {
    console.log(random(2));
    if (random(2) == 1) {
        var food = new foodItem({
            saturation: 50
        });
        if (food.itemType == "food") {
            character.backpack.food.push(food);
        }
        document.getElementById("response-loot").innerHTML = enemy.name + " dropped " + "[" + food.name + "]";
    }

    console.log(character.backpack);
    answer.innerHTML = "You've defeated " + enemy.name + " in battle.";
    document.getElementById("response-xp").innerHTML = "You gained " + enemy.experience + " experience.";
    conflict = false;
    increaseExperience(enemy.experience);
    document.getElementById("enemy-div").classList.add("d-none");
    document.getElementById("attackera-btn").classList.add("d-none");
    document.getElementById("skydda-btn").classList.add("d-none");
    document.getElementById("continue-btn").classList.remove("d-none");
    //enemy.attributes.name + " dropped: " + getLoot(lowLevelLootTable);
    resetEnemy(enemy);
    document.getElementById("continue-btn").addEventListener("click", function() {
        answer.innerHTML = "";
        document.getElementById("map").classList.remove("d-none");
        document.getElementById("response-xp").classList.add("d-none");
        document.getElementById("response-loot").classList.add("d-none");
        document.getElementById("continue-btn").classList.add("d-none");
    });
}

var resetEnemy = function(enemy) {
    var enemyTile = getEnemyTile(enemy);
    enemyTile.innerHTML = "";
    enemy.position.row = random(10);
    enemy.position.column = random(10);
    enemy.hp = enemy.maxHP;
    updateEnemyPosition();
}

var healthColors = [
    //RED
    "#ff0000",
    //GREEN
    "#228B22",
    //YELLOW
    "#FF7F50"
]

function random(length) {
    var random = Math.round(Math.random() * length) + 1;
    return random;
};

function setCharacterHP(HP) {
    hpText.innerHTML = character.currentHP + "/" + character.maxHP;
    $("#hp-text").animate({
        color: healthColors[0]
    }, 250, function() {

        //YELLOW
        if (character.currentHP < character.maxHP / 1.5) {
            $("#hp-text").css({
                color: healthColors[2]
            });
            //RED
        }
        if (character.currentHP < character.maxHP / 3) {
            $("#hp-text").css({
                color: healthColors[0]
            });
            //GREEN
        } else {
            $("#hp-text").css({
                color: healthColors[1]
            });
        }
    });
}

function characterDeath() {
    conflict = false;
    $(".map").removeClass("d-none");
    $("#attackera-btn").addClass("d-none");
    $("#skydda-btn").addClass("d-none");
    $("#enemy-div").addClass("d-none");
    hpText.innerHTML = "0/" + character.maxHP;
    map.style.filter = "invert(100%)";
    isDead = true;
    document.getElementById("response").innerHTML = "You've died.";
}

/* Experience handling */
// Increase experience after battle.
//Setting up the Experience variables
const experienceBar = document.getElementById("experience-bar");
const experienceText = document.getElementById("experience-text");
var levelText = document.getElementById("current-level");
var experienceGained = 0;

function increaseExperience(experienceAmount) {
    experienceGained = experienceAmount;
    while (experienceAmount > 0) {
        character.experience++;
        experienceAmount--;
        if (character.experience >= character.maxExperience) {
            character.experience = 0;
            levelUp();
        }
    }
    updateXpBar();
}

function updateXpBar() {
    $("#experience-bar").progressbar({
        value: parseInt(character.experience),
        max: parseInt(character.maxExperience)
    });
    experienceText.innerHTML = character.experience + "/" + character.maxExperience;
}

function setExperience(experienceAmount) {
    character.experience = experienceAmount;
    updateXpBar();
}

// Handle level up.
function levelUp() {
    //Handle experience
    character.currentLevel++;
    levelText.innerHTML++;
    character.maxExperience = 40 * Math.pow(2, character.currentLevel) + 360 * character.currentLevel;

    $("#hp-text").css({
        color: healthColors[1]
    });

    //Handle attributes
    character.maxHP *= Math.floor((character.currentLevel / 2));
    character.currentHP = character.maxHP;
    hpText.innerHTML = character.currentHP + "/" + character.maxHP;
    updateXpBar();
}

function setLevel(level) {
    levelText.innerHTML = character.currentLevel;
}

//Inventory management
function checkSlots() {
    console.log(character.gear.weapon);
    var slots = document.getElementById("inventory").children;
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].innerHTML != "") {
            console.log(slots[i].innerHTML);
        }
    }
}

//Loot handling
/* Create random items function */
let foodNames = [
    "Apple",
    "Banana",
    "Bread",
    "Meat",
    "Cheese"
];

function foodItem(options) {
    var options = options || {};
    this.name = foodNames[random(foodNames.length)];
    this.saturation = options.saturation || 50;
    this.itemType = "food";
    this.eat = function() {
        if (character.currentHP < character.maxHP) {
            if (this.saturation > 0) {
                character.currentHP += this.saturation;
                this.saturation = 0;
                if (character.currentHP > character.maxHP) {
                    character.currentHP = character.maxHP;
                }
                setCharacterHP(character.currentHP);
            } else {
                delete this;
            }
        } else {
            document.getElementById("response").innerHTML = "You're already at full health.";
        }
    }
}