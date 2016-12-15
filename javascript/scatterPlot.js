class ScatterPlot {
    constructor(data, team) {
        var w = 390,
            h = 400,
            pad = 20,
            left_pad = 50;

        this.svg = d3.select("#the_scatterPlot");
        w =this.svg.style("width").replace("px", "");

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
            left_pad = 50;

        this.remove();

        var maxValue = d3.max(data.map(function (d) { return d.MP; }));
        var x = d3.scale.linear().domain([0, maxValue]).range([left_pad, w - left_pad]);
        var y = d3.scale.linear().domain([1.5, 0]).range([pad, h - pad * 2]);

        var xAxis = d3.svg.axis().orient("bottom").scale(x);
        var yAxis = d3.svg.axis().orient("left").scale(y);

        //Textos
        this.svg.append("text").attr("x", 50).attr("y", 23).style("font-size", "30px").text(team);
        this.svg.append("text").attr("x", 320).attr("y", 370).style("text-anchor", "middle").text("Minutes Played");
        this.svg.append("text").attr("transform", "rotate(-90)").attr("y", 30).attr("x", -50).attr("dy", "1em").style("text-anchor", "middle").text("Impact");

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
            .attr("xlink:href", "http://cyberpuck.com/images/new/basketball.png")
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

                var data = [
                    [//Lebron
                        { axis: "Points", value: d.PTS },
                        { axis: "Assists", value: d.AST },
                        { axis: "Blocks", value: d.BLK },
                        { axis: "Steals", value: d.STL },
                        { axis: "Dribles", value: d.DRB },

                ]];
                drawRadarChart(data);

               /* if (d.Player.split("\\")[0] == "LeBron James") {
                    drawRadarChart("LeBron");
                }
                else if (d.Player.split("\\")[0] == "Stephen Curry") {
                    drawRadarChart("Curry");
                }*/
            })

            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        

    }
    remove(){
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

