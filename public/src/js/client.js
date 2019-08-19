console.log('Client-side code running');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');

var loadedRow;
var loadedCol;

saveButton.addEventListener('click', function(e) {
    var row = character.position.row;
    var column = character.position.column;
    var name = character.attributes.name;
    var currentHP = character.currentHP;
    var maxHP = character.maxHP;
    var maxExperience = character.maxExperience;
    var experience = character.experience;
    var currentLevel = character.currentLevel;

    $.post("http://localhost:8080/save", {
        "row": row,
        "column": column,
        "name": name,
        "currentHP": currentHP,
        "maxHP": maxHP,
        "maxExperience": maxExperience,
        "experience": experience,
        "currentLevel": currentLevel
    }, function(data) {

    });
});

loadButton.addEventListener('click', function(e) {
    fetch('/save', { method: 'GET' })
        .then(function(response) {
            if (response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(function(data) {
            //Load character attributes
            character.attributes.name = data[data.length - 1].name;
            character.currentHP = parseInt(data[data.length - 1].currentHP);
            character.maxHP = parseInt(data[data.length - 1].maxHP);
            character.maxExperience = parseInt(data[data.length - 1].maxExperience);
            character.experience = parseInt(data[data.length - 1].experience);
            character.currentLevel = parseInt(data[data.length - 1].currentLevel);

            setLevel(character.currentLevel);
            setCharacterHP(character.currentHP);
            setExperience(character.experience);

            //Load character position
            var r = document.getElementById("row-" + character.position.row);
            var c = r.childNodes;
            c[character.position.column].style.background = "#eee";
            x.innerHTML = "X: " + data[data.length - 1].row;
            y.innerHTML = "Y: " + data[data.length - 1].column;
            character.position.row = parseInt(data[data.length - 1].row);
            character.position.column = parseInt(data[data.length - 1].column);

            updateCharacterPosition();
        })
        .catch(function(error) {
            console.log(error);
        });
});