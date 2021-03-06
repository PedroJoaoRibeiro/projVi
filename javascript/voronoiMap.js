var elementSelected;
class VoronoiMap {
    constructor(data, topology) {
        this.topology = topology
        var width = 780,
            height = 400;


        this.projection = d3.geo.albers()
            .scale(850).translate([450, 200]);

        this.path = d3.geo.path()
            .projection(this.projection)
            .pointRadius(2.5);


        this.svg = d3.select("#the_VoronoiMap")
            .attr("height", height);

        this.update(data);

    }
    update(data) {
        var width = 780,
            height = 400;
        var voronoi = d3.geom.voronoi()
            .clipExtent([[-1, -1], [width + 1, height + 1]]);

        var projectedPoints = [];
        for (var i = 0; i < data.length; i++) {
            projectedPoints.push(this.projection(data[i].location));
        }

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        this.svg.selectAll("g")
            .remove();
        this.svg.selectAll("image1")
            .remove();
        this.svg.selectAll("image")
            .remove();

        this.g = this.svg.append("g")
            .attr("clip-path", "url(#myClip)");


        this.g.selectAll("path")
            .data(voronoi(projectedPoints))
            .enter()
            .append("path")
            .attr("class", "teams-cells")
            .attr("id", function (d, i) { return data[i].abbreviation; })
            .attr("d", function (d) { return "M" + d.join("L") + "Z"; })
            .on('mouseover', function (d, i) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html(data[i].team + "<br/>" + "Final classification: " + data[i].Rk + "º" + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .append("img")
                    .attr("src", "data/logos/" + data[i].abbreviation + ".png")

                    .attr("width", "200px")
                    .attr("height", "200px");
                tooltip.style("visibility", "visible");
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
            })
            .on("click", function (d, i) {
                highlightMap(data[i]);
                updateScatter(data[i]);
                setGlobalType("team");
                updateStarAxes(data[i]);
                lineC(data[i].team);
                clearToggles();
            });


        this.svg.append("path")
            .datum(topojson.feature(this.topology, this.topology.objects.land))
            .attr("d", this.path);


        this.svg.append("clipPath")
            .attr("id", "myClip")
            .append("path")
            .datum(topojson.feature(this.topology, this.topology.objects.land))
            .attr("d", this.path);

        this.svg.selectAll("image1")
            .data(data)
            .enter()
            .append("image")
            .attr("id", function (d, i) { return data[i].team; })
            .attr("width", function (d) { return d.iconWidth; })
            .attr("height", function (d) { return d.iconHeight; })
            //.attr("xlink:href", "http://cyberpuck.com/images/new/basketball.png")
            //.attr("xlink:href", function (d) { return "logos/"+league+"/"+d.abbreviation+".png";})
            .attr("xlink:href", function (d) { return "data/icons/" + d.abbreviation + ".png"; })
            .attr("transform", function (d, i) { return "translate(" + projectedPoints[i] + ")"; })
            .attr("transform", function (d, i) { return "translate(" + projectedPoints[i] + ")"; })
            .on('mouseover', function (d, i) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html(data[i].team + "<br/>" + "classificação final: " + data[i].Rk + "º" + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .append("img")
                    .attr("src", "data/logos/" + data[i].abbreviation + ".png")

                    .attr("width", "200px")
                    .attr("height", "200px");
                tooltip.style("visibility", "visible");
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
            })
            .on("click", function (d, i) {
                highlightMap(data[i]);
                updateScatter(data[i]);
                setGlobalType("team");
                updateStarAxes(data[i]);
                lineC(data[i].team);
                clearToggles();
                
            });
        
        if(this.elementSelected){
            element = d3.select("#"+ voronoiMap.elementSelected.abbreviation);
            element.attr("fill", voronoiMap.elementSelected.color);
        }
    }
}
function offset(arr, d) {
    return [arr[0] - (d.iconWidth / 2), arr[1] - (d.iconHeight / 2)];
}

function highlightMap(team) {
    if(voronoiMap.elementSelected){
        element = d3.select("#"+ voronoiMap.elementSelected.abbreviation);
        element.attr("fill", "none");
    }
        
    voronoiMap.elementSelected = team;
    element = d3.select("#"+team.abbreviation);
    element.attr("fill", team.color);
    
}

