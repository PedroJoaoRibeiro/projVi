var currentYear, voronoiMap, info;
var dataSet, scatterPlot, barChart, scatterObj ;
var regularSeason = true;

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

function updateSearchBar(suggestion){
    console.log(suggestion);
    // ver se a data e team entao carregar dados equipa se nao carregar dados do player 
}

function setRegularSeason(){
    regularSeason = !regularSeason;
    updateAllData(currentYear);
}

function getTeamsData(year){
    if(regularSeason){
        return "data/equipas_VI/regularSeasonData/" + year + ".json";;
    }
    else{
        return "data/equipas_VI/playOffsData/" + year + ".json";
    }
}

function getPlayersData(year){
    if(regularSeason){
        return "data/Jogadores_VI/regularSeason/" + year + ".json";
    }
    else{
        return "data/Jogadores_VI/playoffs/" + year + ".json";
    }
}

function updateAllData(year){
    currentYear = year;
    info.updateYear();

    updateVoronoi(currentYear);

    if(scatterPlot){
        verify(scatterObj);
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
                data[i].Rk = teams[j].Rk;
                data[i].Overall = teams[j].Overall;
                array.push(data[i]);
                break;
            }
        }
    }
    if (array.length < teams.length){
        array.sort(function(a,b) {
    var x = a.Rk;
    var y = b.Rk;
    return x < y ? -1 : x > y ? 1 : 0;});
        console.log(array);
    }
        
    return array;
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
    var file = getPlayersData(currentYear);
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

function addArray(){
    var dataT = [];
    for ( var i = 0; i < dataG.length; i++){
        var aux = [];
        if($('#toggle-PTSs').prop('checked')){
            aux.push({ axis: "Points", value: dataG[i].PTS })
            
        }

        if($('#toggle-ASTs').prop('checked')){
            aux.push({ axis: "Assists", value: dataG[i].AST })
            
        }

        if($('#toggle-TRBs').prop('checked')){
            aux.push({ axis: "Rebounds", value: dataG[i].TRB })
            
        }

        if($('#toggle-STLs').prop('checked')){
            aux.push({ axis: "Steals", value: dataG[i].STL })
            
        }  

        if($('#toggle-DRBs').prop('checked')){
            aux.push({ axis: "Dribles", value: dataG[i].DRB })
            
        }

        if($('#toggle-2PTs').prop('checked')){
            aux.push({ axis: "2 Point", value: dataG[i]['2P'] })
            
        }

        if($('#toggle-3PTs').prop('checked')){
            aux.push({ axis: "3 Point", value: dataG[i]['3P'] })
            
        }                 

        dataT.push(aux);
    }
    drawRadarChart(dataT);

}

function updateStarAxes(d) {
    if (comparator){
        if ( dataG.length < 2){
            dataG.push(d);
        }
        else {
            datG[1]=d;
        }
    }
    else {
        dataG[0] = d;
    }
    addArray();
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


