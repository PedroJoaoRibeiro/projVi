var dataSet, scatterPlot, barChart, average;

//BUTTONS

function doScatterPlot() {
    var file = "data/Jogadores_VI/playoffs/2016.json";
    d3.json(file, function (data) {
        var aux = selectFromData(data, "Tm", "OKC");
        scatterPlot = new ScatterPlot(aux);
    });

}

class ScatterPlot {
    constructor(data) {
        average = this.calculateAverage(data);
        var w = 940,
            h = 300,
            pad = 20,
            left_pad = 100;


        this.svg = d3.select("#the_scatterPlot")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var maxValue = d3.max(data.map(function (d) { return d.MP; }));
        var x = d3.scaleLinear().domain([0, maxValue]).range([left_pad, w - pad]);
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

        this.update(data);
            
    }

    calculateAverage(data) {
        var average = 0;
        var cont = 0;
        while (data.length > cont) {
            average += data[cont].Impact;
            cont++;
        }
        return average / cont;
    }

    update(data){
        var w = 940,
            h = 300,
            pad = 20,
            left_pad = 100;

        
        var maxValue = d3.max(data.map(function (d) { return d.MP; }));
        var x = d3.scaleLinear().domain([0, maxValue]).range([left_pad, w - pad]);
        var y = d3.scaleLinear().domain([1.5, 0]).range([pad, h - pad * 2]);

        var tooltip = d3.select("#the_scatterPlot")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        this.svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) {
                return x(d.MP);
            })
            .attr("cy", function (d) {
                return y(d.Impact);
            })
            .attr("r", function (d) {
                return 5;
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.Player.split("\\")[0] + "<br/>" + d.Impact.toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


            this.svg.append("line")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .attr("x1", x(0))
            .attr("x2", x(maxValue))
            .attr("y1", y(average))
            .attr("y2", y(average))
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Impact " + average.toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
        
}

//Aux Methods

function selectFromData(data, type, value) {
    var array = [];
    for (i = 0; i < data.length; i++) {
        if (data[i][type] == value) {
            array.push(data[i]);
        }
    }
    return array;
}

function verify(obj){
    var file = "data/Jogadores_VI/playoffs/2016.json";
    d3.json(file, function (data) {
        var aux = selectFromData(data, "Tm",obj.abbreviation);
        if(scatterPlot == null)
            scatterPlot = new ScatterPlot(aux);
        else
            scatterPlot.update(aux);
    });
}