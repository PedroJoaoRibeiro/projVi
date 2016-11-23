class StarPlot {
    constructor(data) {
        
    }
}


function selectPlayers(p1, p2, data) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
        name = data[i]["Player"];
        if (name.includes(p1)) {
            array.push(data[i]);
        }
        if (name.includes(p2) && p2 != "") {
            array.push(data[i]);
        }
    }
    return array;
}


function doStarPlot() {
    var file = "data/Jogadores_VI/Players/2015.json";
    d3.json(file, function (data) {
        var array = selectPlayers("Jordan Adams", "Evan Turner", data);
        starPlot = new StarPlot(array);
    });
}