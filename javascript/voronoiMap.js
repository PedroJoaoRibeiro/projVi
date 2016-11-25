class VoronoiMap {
    constructor(data) {
        var width = 960,
            height = 500;

        var projection = d3.geoAlbers()
            .translate([width / 2, height / 2])
            .scale(1280);
        var path = d3.geoPath()
            .projection(projection)
            .pointRadius(2.5);

        var svg = d3.select("#the_VoronoiMap").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("data/us.json", function (error, topology) {
            if (error) throw error;

            svg.append("path")
                .datum(topojson.feature(topology, topology.objects.land))
                .attr("d", path);
        });
    }
}





function main() {
    var file = "data/equipas_VI/teams.json";
    d3.json(file, function (data) {
        var voronoiMap = new VoronoiMap(data);
    });

}