var currentYear, voronoiMap;
class VoronoiMap {
    constructor(data, topology) {
        this.topology = topology
        var width = 900,
            height = 600;

        this.projection = d3.geo.albers()
            .scale(1100).translate([430, 340]);

        this.path = d3.geo.path()
            .projection(this.projection)
            .pointRadius(2.5);


        this.svg = d3.select("#the_VoronoiMap").append("svg")
            .attr("width", width)
            .attr("height", height);

        this.update(data);

    }
    update(data) {
        var width = 900,
            height = 600;
        var voronoi = d3.geom.voronoi()
            .clipExtent([[-1, -1], [width + 1, height + 1]]);

        var projectedPoints = [];
        for (var i = 0; i < data.length; i++) {
            projectedPoints.push(this.projection(data[i].location));
        }

        var tooltip = d3.select("#the_scatterPlot")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg.selectAll("path")
            .remove();

        this.svg.selectAll("path")
            .data(voronoi(projectedPoints))
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
                tooltip.html(data[i].team + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (d, i) {
                verify(data[i]);
            });
            var x = this.projection;
            this.svg.append("path")
            .datum(topojson.feature(this.topology, this.topology.objects.land))
            .attr("d", this.path);

            this.svg.selectAll("image1")
            .data(data)
            .enter()
            .append("image1")
            .attr("width", function (d) { return d.iconWidth; })
            .attr("height", function (d) { return d.iconHeight; })
            .attr("xlink:href", "http://cyberpuck.com/images/new/basketball.png")
            //.attr("xlink:href", function (d) { return "logos/"+league+"/"+d.abbreviation+".png";})
            .attr("transform", function (d,i) { return "translate(" + offset(x(d.location),d) + ")"; }); 
            

    }
}
function offset(arr,d) {
      return [arr[0] - (d.iconWidth/2), arr[1] - (d.iconHeight/2)];
}   

function main() {
    currentYear = 2016;
    var file = "data/equipas_VI/teams.json";
    var file1 = "data/Playoff_Equipas_VI/2016.json";
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

function selectTeamsToPlayoffs(data, teams) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < teams.length; j++) {
            if (data[i].team == teams[j].Team) {
                array.push(data[i]);
                break;
            }
        }
    }
    if (array.length != 16)
        console.log("ver nomes de equipas mal");
    return array;
}

function updateVoronoi(year) {
    console.log("here");
    currentYear = year;

    var file = "data/equipas_VI/teams.json";
    var file1 = "data/Playoff_Equipas_VI/" + currentYear + ".json";
    d3.json(file, function (data) {
        d3.json(file1, function (teams) {
            var array = selectTeamsToPlayoffs(data, teams);
            console.log(array);
            voronoiMap.update(array);

        });
    });
}