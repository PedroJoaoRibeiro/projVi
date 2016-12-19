var dataS;
class ScatterPlot {
    constructor(data, team) {
        var w = 390,
            h = 400,
            pad = 20,
            left_pad = 80;

        this.svg = d3.select("#the_scatterPlot");
        w = this.svg.style("width").replace("px", "");

        this.update(data, team);

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

    update(data, team) {
        var w = this.svg.style("width").replace("px", ""),
            h = 400,
            pad = 20,
            left_pad = 80;

        this.remove();

        var maxValue = d3.max(data.map(function (d) { return d.MP; }));
        var maxImpact = d3.max(data.map(function (d) { return d.Impact; }));
        var x = d3.scale.linear().domain([0, maxValue]).range([left_pad, w - left_pad]);
        var y = d3.scale.linear().domain([maxImpact + 0.5, 0]).range([pad, h - pad * 2]);

        var xAxis = d3.svg.axis().orient("bottom").tickFormat(d3.format("d")).scale(x);
        var yAxis = d3.svg.axis().orient("left").scale(y);

        //Textos

        this.svg.append("text").attr("x", 200).attr("y", 23).style("font-size", "30px").text("Impact Of Players");
        this.svg.append("text").attr("x", 500).attr("y", 370).style("text-anchor", "middle").text("Minutes Played");
        this.svg.append("text").attr("transform", "rotate(-90)").attr("y", 60).attr("x", -50).attr("dy", "1em").style("text-anchor", "middle").text("Impact");



        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (left_pad - pad) + ", 0)")
            .call(yAxis);

        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + (h - pad) + ")")
            .call(xAxis);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        if (data.length == 0 && !regularSeason)
            this.svg.append("text").attr("x", 90).attr("y", 200).style("font-size", "20px").text("Team didn't get to playoffs this year");
        else if (data.length == 0 && regularSeason)
            this.svg.append("text").attr("x", 90).attr("y", 200).style("font-size", "20px").text("Team didn't Played in this year");
        else {
            var average = this.calculateAverage(data);


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

            this.svg.selectAll("image")
                .data(data)
                .enter()
                .append("image")
                //.attr("class", "circle")
                .attr("id", function (d) {
                    var p = d.Player.split("\\")[0].split('.').join("").split(' ').join('');
                    return p.split('*').join("")
                })
                .attr("xlink:href", "data/icons/basketball.png")
                .attr("width", 16)
                .attr("height", 16)
                .attr("x", function (d) {
                    return x(d.MP);
                })
                .attr("y", function (d) {
                    return y(d.Impact);
                })
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d.Player.split("\\")[0] + "<br/>" + d.Impact.toFixed(2))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                .on("click", function (d) {
                    var p = d.Player.split("\\")[0].split('.').join("").split(' ').join('');
                    higlightScatter(p.split('*').join(""));
                    var file = "data/equipas_VI/teams.json";
                    d3.json(file, function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].abbreviation == d.Tm) {
                                info.updateTeamSelected(data[i].team, d.Tm);
                                info.updatePlayerName(d.Player.split("\\")[0]);
                            }
                        }

                    });
                    
                    setGlobalType("player");
                    updateStarAxes(d);
                    lineC(d.Player);
                    clearToggles();
                })

                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }
    }
    remove() {
        this.svg.selectAll("g")
            .remove();
        this.svg.selectAll("path")
            .remove();
        this.svg.selectAll("line")
            .remove();
        this.svg.selectAll("image")
            .remove();
        this.svg.selectAll("text")
            .remove();
    }

}
//fix me
function higlightScatter(player) {
    if (comparator) {
        if (scatterPlot.elementSelected2) {
            var element = d3.select("#" + scatterPlot.elementSelected2);
            element.attr("xlink:href", "data/icons/basketball.png");
            element.attr("width", 16);
            element.attr("height", 16);
        }
        var element = d3.select("#" + player);
        element.attr("xlink:href", "data/icons/basVermelha.png");
        element.attr("width", 23);
        element.attr("height", 23);
        scatterPlot.elementSelected2 = player;

    }
    else {
        if (scatterPlot.elementSelected2) {
            var element = d3.select("#" + scatterPlot.elementSelected2);
            element.attr("xlink:href", "data/icons/basketball.png");
            element.attr("width", 16);
            element.attr("height", 16);
        }
        if (scatterPlot.elementSelected) {
            var element = d3.select("#" + scatterPlot.elementSelected);
            element.attr("xlink:href", "data/icons/basketball.png");
            element.attr("width", 16);
            element.attr("height", 16);
        }
        var element = d3.select("#" + player);
        element.attr("xlink:href", "data/icons/basAmarela.png");
        element.attr("width", 23);
        element.attr("height", 23);
        scatterPlot.elementSelected = player;
    }


}

// funçao para os vários botões do star
/*function updateStarAxes(d) {
    if (atrSet == perc) {
        dataS = [
            [
                { axis: "Field Goals", value: d.FG% },
                { axis: "3 points", value: d.3P% },
                { axis: "2 points", value: d.2P% },
                { axis: "Free throws", value: d.FT% },

            ]];
    }
    drawRadarChart(dataS);
}
*/
