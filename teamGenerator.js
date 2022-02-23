//team counter:
const maxInputLength = 4;
let teamCountInput = document.getElementById('team_count_input');
teamCountInput.addEventListener('input', function (evt) {
    teamCountInput.value = teamCountInput.value.replace(/[^0-9]/g, '').substring(0, maxInputLength);
});

//increment/decrement team counter:
const initialDelay = 600, delay = 100;
let incTimeout, decTimeout;

let incTeamCountButton = document.getElementById('inc_team_count');
incTeamCountButton.addEventListener('mousedown', function (evt) {

    let timeoutFunc = function() {
        incTimeout = setTimeout(timeoutFunc, delay);
        incTeamCounter();
    }
    incTimeout = setTimeout(timeoutFunc, initialDelay);

});

let decTeamCountButton = document.getElementById('dec_team_count');
decTeamCountButton.addEventListener('mousedown', function (evt) {

    let timeoutFunc = function() {
        decTimeout = setTimeout(timeoutFunc, delay);
        decTeamCounter();
    }
    decTimeout = setTimeout(timeoutFunc, initialDelay);

});

window.addEventListener('mouseup', function (evt) {
    clearTimeout(incTimeout);
    clearTimeout(decTimeout);
});

function incTeamCounter() {
    let value = parseInt(teamCountInput.value);
    
    if(value < 9999) {
        teamCountInput.value = value + 1;
    }
    if(isNaN(value)) {
        teamCountInput.value = 1;
    }
}

function decTeamCounter() {
    let value = parseInt(teamCountInput.value);
    if(value > 0) {
        teamCountInput.value = value - 1;
    }
}

//player input:
let playerInput = document.getElementById('players_text_area');
let playerCount = document.getElementById('players_count');
playerInput.addEventListener('input', function (evt) {
    updatePlayersInputCount();
});

function updatePlayersInputCount() {
    playerCount.innerHTML = '<i class="fas fa-user"></i>Spieler: ' + getPlayerInputCount();
}
updatePlayersInputCount();

function getPlayerInputCount() {
    return playerInput.value.split('\n').filter(String).length;
}
function getTeamInputCount() {
    return teamCountInput.value;
}

//generating the teams:
class Team {

    constructor(players, teamName) {
        this.players = players;
        this.teamName = teamName;
    }

    getHTML() {

        let container = document.createElement("div");
        container.classList.add("team_container");

        let teamName = document.createElement("h1");
        teamName.innerHTML = this.teamName;
        container.appendChild(teamName);

        for(let i = 0; i < this.players.length; i++) {
            let teamMember = document.createElement("span");
            teamMember.innerHTML = "<a>&bull;</a>" + this.players[i];
            container.appendChild(teamMember);
        }

        return container;

    }

}

function createTeamList() {

    let teamsDiv =  document.getElementById("teams");
    teamsDiv.innerHTML = "";

    let teamCount = getTeamInputCount();
    let players = playerInput.value.split('\n').filter(String);
    let shuffledPlayers = shuffle(players);

    let teams = createTeams(shuffledPlayers, teamCount);
    
    for(let i = 1; i <= teams.length; i++) {

        let team = new Team(teams[i - 1], "Team " + i);
        teamsDiv.appendChild(team.getHTML());

    }
}

function shuffle(arr) {

    let newArr = [];

    while(arr.length) {

        let randomIndex = Math.floor(Math.random() * arr.length),
        element = arr.splice(randomIndex, 1)

        newArr.push(element[0]);       

    }
    return newArr;

}

function createTeams(players, teamCount) {

    let teamsArr = [];

    let minPlayersPerTeam = Math.floor(players.length / teamCount);
    let remainder = players.length % teamCount;

    if(minPlayersPerTeam > 0) {
        for(let i = 0; i < teamCount; i++) {
            let newTeam = players.splice(0, minPlayersPerTeam);
            teamsArr[i] = newTeam;
        }
        for(let i = 0; i < remainder; i++) {
            teamsArr[i].push(players.shift());
        }
    } else {
        for(let i = 0; i < remainder; i++) {
            teamsArr[i] = new Array(players.shift());
        }
    }

    return teamsArr;

}


