var dataSet, scatterPlot;
function main() {
    dataSet = new Data("TOT");
    //scatterPlot = new ScatterPlot();
}

function getPlayersDataByTeam(teamName, obj) {
    for (i = 1950; i < 2016; i++) {
        var file = "data/Jogadores_VI/playoffs/" + i + ".json";
        d3.json(file, function (data) {
            selectFromData(data, "Tm", teamName, obj);
        });
    }
}

function selectFromData(data, type, value) {
    var array = [];
    for (i = 0; i < data.length; i++) {
        if (data[i][type] == value) {
            array.push(data[i]);
        }
    }
    return array;
}

class Data {
    constructor(teamName) {
        this.data = [];
        getPlayersDataByTeam(teamName, this);
    }
    addData(array) {
        this.data.push(array);
    }
    getData(i) {
        return this.data[i];
    }
}


class ScatterPlot {
    constructor(aux) {
        this.dataSet = [];
        var w = 940,
            h = 300,
            pad = 20,
            left_pad = 100;


        this.svg = d3.select("#the_scatterPlot")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var x = d3.scaleLinear().domain([2013, 2016]).range([left_pad, w - pad]);
        var y = d3.scaleLinear().domain([1.5, 0]).range([pad, h - pad * 2]);

        var xAxis = d3.axisBottom().scale(x);
        var yAxis = d3.axisLeft().scale(y);


        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + (h - pad) + ")")
            .call(xAxis);

        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (left_pad - pad) + ", 0)")
            .call(yAxis);

        this.svg.selectAll("circle")
            .data(aux)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) {
                console.log(this.x);
                return x(2015);
            })
            .attr("cy", function (d) {
                return y(d.Impact);
            })
            .attr("r", function(d){
                return 3;
            });
    }
}

//BUTTONS

function doFunction() {
    var file = "data/Jogadores_VI/Players/2015.json";
        d3.json(file, function (data) {
            var aux = selectFromData(data, "Tm", "TOT");
            console.log(aux);
            scatterPlot = new ScatterPlot(aux);
        });
    
}