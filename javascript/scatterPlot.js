var dataSet;

function main(){
    dataSet = new Data();
    getTeamData("TOT");
    var scatterPlot = new ScatterPlot(dataSet.data);
}

function getTeamData(teamName){
    for(i = 1950; i< 2016; i++){
        var file = "data/Jogadores_VI/Players/" + i + ".json";
        d3.json(file, function (data) {
            selectFromData(data,"Tm", teamName);
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
    console.log(array);
    dataSet.add(array);
}

class Data{
    constructor(){
        this.data = [];
    }
    add(value){
        this.data.push(value);
    }
}


class ScatterPlot {
    constructor(data) {
        this.dataset = data;
        var w = 940,
            h = 300,
            pad = 20,
            left_pad = 100;


        this.svg = d3.select("#the_scatterPlot")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var x = d3.scaleLinear().domain([0,40]).range([left_pad, w - pad]);
        var y = d3.scaleLinear().domain([2, 0]).range([pad, h - pad * 2]);

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


        var max_r = d3.max(data.map(
                       function (d) { return d[2]; })),
        r = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.Impact / 10; })]);
        
        this.svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) { return x(d.Age); })
            .attr("cy", function (d) { return x(d.Impact); })
            .attr("r", function (d) { return r(d.Impact); });
    }
}