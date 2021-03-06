var currentYear, voronoiMap, info, globalType;
var dataSet, scatterPlot, barChart, scatterObj;
var yellow, red;
var regularSeason = true;
var nullObj = {
    PTS: 0,
    STL: 0,
    TRB: 0,
    AST: 0,
    "2P": 0,
    "3P": 0,
    "FG%": 0,
    "3P%": 0,
    "2P%": 0,
    "FT%": 0
}

// LOGICA

function main() {
    currentYear = 2016;
    var file = "data/equipas_VI/teams.json";
    var file1 = getTeamsData(currentYear);
    d3.json(file, function (data) {
        d3.json(file1, function (teams) {
            d3.json("data/us.json", function (error, topology) {
                if (error) throw error;
                var array = selectTeamsToPlayoffs(data, teams);
                voronoiMap = new VoronoiMap(array, topology);

            });

        });
    });

}

function updateSearchBar(suggestion) {
    if (suggestion.data == "player") {
        setGlobalType("player");
        getLastTeamYear(suggestion.value, false, 2016);
    }
    else {
        setGlobalType("team");
        getLastTeamYear(suggestion.value, false, 2016);
    }
}

function updateAfterCalculus(player, year, d) {
    currentYear = year;
    info.updateYear();
    changeSliderToYear(currentYear);
    updateVoronoi(currentYear);
    fixDataInD(d);
}

function updateAfterCalculusPlayer(player, year, data) {
    currentYear = year;
    info.updateYear();
    changeSliderToYear(currentYear);
    updateVoronoi(currentYear);
    updateScatterPlayer(data[0]);
    lineC(data[0].Player);
    updateStarAxes(data[0]);
}

function fixDataInD(d) {
    d3.json("data/equipas_VI/teams.json", function (data) {
        var array = selectTeamsToPlayoffs(data, d);
        highlightMap(array[0]);
        updateScatter(array[0]);
        updateStarAxes(array[0]);
    });
}

function setRegularSeason() {
    regularSeason = !regularSeason;
    updateAllData(currentYear);
}

function getTeamsData(year) {
    if (regularSeason) {
        return "data/equipas_VI/regularSeasonData/" + year + ".json";;
    }
    else {
        return "data/equipas_VI/playOffsData/" + year + ".json";
    }
}


function getPlayersData(year) {
    if (regularSeason) {
        return "data/Jogadores_VI/regularSeason/" + year + ".json";
    }
    else {
        return "data/Jogadores_VI/playoffs/" + year + ".json";
    }
}

function updateAllData(year) {
    currentYear = year;
    info.updateYear();

    updateVoronoi(currentYear);

    if (scatterPlot) {
        updateScatter(scatterObj);
    }
    if (chart) {
        lineC(chart.player);
    }
    if (!comparator) {
        if (radar) {
            updateDataForStar(year);
        }
    }

}

function getGlobalType(year) {
    if (globalType == "team")
        return getTeamsData(year);
    else
        return getPlayersData(year);
}

function setGlobalType(type) {
    globalType = type;
}

function changeSliderToYear(year) {

}

function getLastTeamYear(player, bool, year, data) {
    if (bool) {
        if (globalType == "team")
            updateAfterCalculus(player, year, data);
        else
            updateAfterCalculusPlayer(player, year, data);
    }
    else {
        d3.json(getGlobalType(year), function (data) {
            var array = selectFromData(data, "Player", player);
            if (array.length > 0)
                getLastTeamYear(player, true, year, array);
            else
                getLastTeamYear(player, false, year - 1, data);
        });
    }
}






//Aux Methods voronoiMap

function updateVoronoi(year) {
    var file = "data/equipas_VI/teams.json";
    var file1 = getTeamsData(currentYear);
    d3.json(file, function (data) {
        d3.json(file1, function (teams) {
            var array = selectTeamsToPlayoffs(data, teams);
            voronoiMap.update(array);

        });
    });

}

function selectTeamsToPlayoffs(data, teams) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < teams.length; j++) {
            if (data[i].team == teams[j].Team.split('*').join("")) {
                teams[j].team = data[i].team;
                teams[j].location = data[i].location;
                teams[j].abbreviation = data[i].abbreviation;
                teams[j].iconWidth = data[i].iconWidth;
                teams[j].iconHeight = data[i].iconHeight;
                teams[j].color = data[i].color;
                array.push(teams[j]);
                break;
            }
        }
    }
    if (array.length < teams.length) {
        array.sort(function (a, b) {
            var x = a.Rk;
            var y = b.Rk;
            return x < y ? -1 : x > y ? 1 : 0;
        });
        console.log(array);
    }

    return array;
}


//Aux Methods ScatterPlot

function selectFromData(data, type, value) {
    var array = [];
    for (i = 0; i < data.length; i++) {
        if (data[i][type].split("\\")[0] == value.split("\\")[0]) {
            array.push(data[i]);
        }
    }
    return array;
}

// da update ao scatterPlot se nao existir cria recebe um objecto que contem o abreviation e nome de equipa
function updateScatter(obj) {
    scatterObj = obj;
    info.updateTeamSelected(obj.team, obj.abbreviation);
    var file = getPlayersData(currentYear);
    d3.json(file, function (data) {
        var aux = selectFromData(data, "Tm", obj.abbreviation);

        if (scatterPlot == null)
            scatterPlot = new ScatterPlot(aux, obj.team);
        else
            scatterPlot.update(aux, obj.team);
    });
}
function updateScatterPlayer(player) {
    var file = "data/equipas_VI/teams.json";
    d3.json(file, function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].abbreviation == player.Tm) {
                fixDataScatter(data[i]);
            }
        }

    });
}

function fixDataScatter(data) {
    d3.json(getTeamsData(currentYear), function (team) {
        for (var j = 0; j < team.length; j++) {
            if (data.team == team[j].Team.split('*').join("")) {
                team[j].team = data.team;
                team[j].location = data.location;
                team[j].abbreviation = data.abbreviation;
                team[j].color = data.color;
                highlightMap(team[j]);
                updateScatter(team[j]);
            }
        }
    });
}


function removeScatter() {
    scatterPlot.remove();
    scatterPlot = null;
}

var comparator = 0;
var dataG = [];
function Comparator() {
    if (comparator == 0) {
        comparator = 1;
    }
    else {
        comparator = 0;
    }
}

//starPlot Methods

function addArray() {
    var dataT = [];
    for (var i = 0; i < dataG.length; i++) {
        var aux = [];
        if ($('#toggle-PTSs').prop('checked')) {
            aux.push({ axis: "Points", value: dataG[i].PTS })

        }

        if ($('#toggle-ASTs').prop('checked')) {
            aux.push({ axis: "Assists", value: dataG[i].AST })

        }

        if ($('#toggle-TRBs').prop('checked')) {
            aux.push({ axis: "Rebounds", value: dataG[i].TRB })

        }

        if ($('#toggle-STLs').prop('checked')) {
            aux.push({ axis: "Steals", value: dataG[i].STL })

        }

        if ($('#toggle-DRBs').prop('checked')) {
            aux.push({ axis: "Dribbles", value: dataG[i].DRB })

        }

        if ($('#toggle-2PTs').prop('checked')) {
            aux.push({ axis: "2 Point", value: dataG[i]['2P'] })

        }

        if ($('#toggle-3PTs').prop('checked')) {
            aux.push({ axis: "3 Point", value: dataG[i]['3P'] })

        }

        if ($('#toggle-PERs').prop('checked')) {
            aux = [

                { axis: "Field Goals", value: dataG[i]['FG%'] },
                { axis: "3 points", value: dataG[i]['3P%'] },
                { axis: "2 points", value: dataG[i]['2P%'] },
                { axis: "Free throws", value: dataG[i]['FT%'] },
            ];

        }

        if (aux.length < 3) {
            return false;
        }
        dataT.push(aux);
    }
    drawRadarChart(dataT);

}

function updateStarAxes(d) {
    if (comparator) {
        if (dataG.length < 2) {
            dataG.push(d);
        }
        else {
            dataG[1] = d;
        }
    }
    else {
        dataG = [];
        dataG[0] = d;
    }
    addArray();
}

function updateDataForStar(year) {
    if (dataG[0]) {
        var player = dataG[0].Player;
        d3.json(getGlobalType(year), function (error, data) {
            if (error) throw error;
            var array = selectFromData(data, "Player", player);
            console.log(array);
            dataG[0] = array[0];
            addArray();
        });
    }
}


function colapseYellow(bool) {
    if (bool) {
        if (yellow) {
            dataG[0] = yellow;
            yellow = null;
        }
    }
    else {
        yellow = dataG[0];
        dataG[0] = nullObj;
    }
    addArray();
}
function colapseRed(bool) {
    if (bool) {
        if (red) {
            dataG[1] = red;
            red = null;
        }
    }
    else {
        red = dataG[1];
        dataG[1] = nullObj;
    }
    addArray();
}

function clearToggles() {
    $('#toggle-AST').bootstrapToggle('off');
    $('#toggle-TRB').bootstrapToggle('off');
    $('#toggle-DRB').bootstrapToggle('off');
    $('#toggle-STL').bootstrapToggle('off');
    $('#toggle-PTS').bootstrapToggle('on');
}


class Info {
    constructor() {
        this.svg = document.getElementById('info');
        this.mvp = document.getElementById('mvp');
        this.year = document.getElementById('infoYear');
        this.team = document.getElementById('infoTeam');
        this.player = document.getElementById('infoPlayer');
        this.playerpic = document.getElementById('playerPic');
        this.teampic = document.getElementById('teamPic');

        this.team2 = document.getElementById('infoTeam2');
        this.player2 = document.getElementById('infoPlayer2');
        this.playerpic2 = document.getElementById('playerPic2');
        this.teampic2 = document.getElementById('teamPic2');
    }
    updateYear() {
        this.year.innerHTML = "Selected year: " + currentYear;
        d3.json("data/mvp.json", function (mvp) {
            var index = 2016 - currentYear;
            if (index < 60) {
                var playerName = mvp[index].Player.split('*').join("");
                info.mvp.innerHTML = "MVP: " + playerName.split("\\")[0];
            }
            else {
                info.mvp.innerHTML = "No MVP this season";
            }
        });
    }
    updateTeamSelected(teamName, abbreviation) {
        if (!comparator) {
            this.team.innerHTML = teamName;
            this.teampic.src = 'data/logos/' + abbreviation + '.png';
            this.player.innerHTML = "";
            this.playerpic.src = "";
            this.playerpic.className ="hidden";
        }
        else {
            this.team2.innerHTML = teamName;
            this.teampic2.src = 'data/logos/' + abbreviation + '.png';
            this.player2.innerHTML = "";
            this.playerpic2.src = "";
            this.playerpic2.className ="hidden";
        }

    }
    updatePlayerName(player) {
        if (!comparator) {
            this.playerpic.className ="";
            this.player.innerHTML = player.split('*').join("");
            this.playerpic.onerror = function () {
                if(this.src != "")
                    this.src = 'data/pics/unknown.png'; // place your error.png image instead
            };

            this.playerpic.src = 'data/pics/' + player.split('*').join("") + '.png#';


        }
        else {
            this.playerpic2.className ="";
            this.player2.innerHTML = player.split('*').join("");
            this.playerpic2.onerror = function () {
                this.src = 'data/pics/unknown.png'; // place your error.png image instead
            };
            this.playerpic2.src = 'data/pics/' + player.split('*').join("") + '.png#';
        }
    }
    verifyTeam() {
        if (this.team.innerHTML != "") {
            this.team2.innerHTML = this.team.innerHTML;
            this.teampic2.src = this.teampic.src;
        }
    }
    remove() {
        this.team2.innerHTML = "";
        this.teampic2.src = "";
        this.player2.innerHTML = "";
        this.playerpic2.src = "";
        this.playerpic2.className ="hidden";
    }
}


