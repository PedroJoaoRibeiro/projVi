class VoronoiMap {
    constructor(data) {
        var width = 900,
            height = 600;

        var projection = d3.geoAlbers()
            .scale(1100).translate([430, 340]);
        var path = d3.geoPath()
            .projection(projection)
            .pointRadius(2.5);

        var voronoi = d3.voronoi()
            .extent([[-1, -1], [width + 1, height + 1]]);

        var svg = d3.select("#the_VoronoiMap").append("svg")
            .attr("width", width)
            .attr("height", height);

        var tooltip = d3.select("#the_scatterPlot")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.json("data/us.json", function (error, topology) {
            if (error) throw error;

            svg.append("path")
                .datum(topojson.feature(topology, topology.objects.land))
                .attr("d", path);


            var projectedPoints = [];
            for (var i = 0; i < data.length; i++) {
                projectedPoints.push(projection(data[i].location));
            }

            svg.selectAll("path")
                .data(voronoi.polygons(projectedPoints))
                .enter()
                .append("path")
                .attr("class", "teams-cells")
                .attr("id", function (d, i) { return data[i].abbreviation; })
                .attr("d", function (d) { return "M" + d.join("L") + "Z"; })
                .attr("fill", function (d, i) { return data[i].color; })
                .on('mouseover', function (d, i) {

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(data[i].team + "<br/>" )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on('mouseout', function () {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });


    }
}





function main() {
    var file = "data/equipas_VI/teams.json";
    d3.json(file, function (data) {
        var voronoiMap = new VoronoiMap(data);
    });

}