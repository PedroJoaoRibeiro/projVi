var currentYear, voronoiMap, info;
var dataSet, scatterPlot, barChart, scatterObj ;

// LOGICA

function main() {
    currentYear = 2016;
    var file = "data/equipas_VI/teams.json";
    var file1 = "data/Playoff_Equipas_VI/" + currentYear + ".json";
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

function updateSearchBar(suggestion){
    console.log(suggestion);
    // ver se a data e team entao carregar dados equipa se nao carregar dados do player 
}









//Aux Methods voronoiMap

function selectTeamsToPlayoffs(data, teams) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < teams.length; j++) {
            if (data[i].team == teams[j].Team) {
                data[i].Rk = teams[j].Rk;
                data[i].Overall = teams[j].Overall;
                array.push(data[i]);
                break;
            }
        }
    }
    if (array.length != 16)
        console.log("ver nomes de equipas mal");
    return array;
}

function updateVoronoi(year) {
    currentYear = year;
    info.updateYear();

    var file = "data/equipas_VI/teams.json";
    var file1 = "data/Playoff_Equipas_VI/" + currentYear + ".json";
    d3.json(file, function (data) {
        d3.json(file1, function (teams) {
            var array = selectTeamsToPlayoffs(data, teams);
            voronoiMap.update(array);

        });
    });
    if(scatterPlot){
        verify(scatterObj);
    }
}







//Aux Methods ScatterPlot

function selectFromData(data, type, value) {
    var array = [];
    for (i = 0; i < data.length; i++) {
        if (data[i][type] == value) {
            array.push(data[i]);
        }
    }
    return array;
}

// da update ao scatterPlot se nao existir cria recebe um objecto que contem o abreviation e nome de equipa
function verify(obj) {
    scatterObj = obj;
    info.updateTeamSelected(obj.team);
    var file = "data/Jogadores_VI/playoffs/" + currentYear + ".json";
    d3.json(file, function (data) {
        var aux = selectFromData(data, "Tm", obj.abbreviation);

        if (scatterPlot == null)
            scatterPlot = new ScatterPlot(aux, obj.team);
        else
            scatterPlot.update(aux, obj.team);
    });
}


function removeScatter(){
    scatterPlot.remove();
    scatterPlot = null;
}


class Info {
    constructor(){
        this.svg = document.getElementById('info');
        this.year = document.getElementById('infoYear');
        this.team = document.getElementById('infoTeam');
        this.player = document.getElementById('infoPlayer');
    }
    updateYear(){
        this.year.innerHTML = "Selected year: " +currentYear;
    }
    updateTeamSelected(teamName){
        this.team.innerHTML = "Team: " + teamName;
        this.player.innerHTML = ""; 
    }
    updatePlayerName(player){
        this.player.innerHTML = "Player: " + player;
    }
}


