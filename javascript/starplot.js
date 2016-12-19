var radar;
var format = 'f';
class RadarChart {
  constructor(id, data, options) {
    $( "#toglesStar" ).removeClass( "hidden" );
    $( "#toglesStarBottom" ).removeClass( "hidden" );
    $( "#toglesStarBottom1" ).removeClass( "hidden" );
    
    this.id = id;
    var cfg = {
      w: 250,
      h: 250,
      margin: { top: 80, right: 80, bottom: 80, left: 80 },
      maxValue: 1,
      levels: 5,
      roundStrokes: true,
      color: d3.scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"]),
      labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, 	//The opacity of the area of the blob
      dotRadius: 4, 			//The size of the colored circles of each blog
      opacityCircles: 0.1, 	//The opacity of the circles of each blob
      strokeWidth: 2		//The width of the stroke around each blob
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
      for (var i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));

    var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
      Format = d3.format(format),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scale.linear()
      .range([0, radius])
      .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar" + id);
    //Append a g element
    var g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function (d, i) { return radius / cfg.levels * d; })
      .style("fill", "#a0a0a0")
      .style("stroke", "#a0a0a0")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function (d) { return -d * radius / cfg.levels; })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function (d, i) { return Format(maxValue * d / cfg.levels); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
      .text(function (d) { return d })
      .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.svg.line.radial()
      .interpolate("linear-closed")
      .radius(function (d) { return rScale(d.value); })
      .angle(function (d, i) { return i * angleSlice; });

    if (cfg.roundStrokes) {
      radarLine.interpolate("cardinal-closed");
    }

    //Create a wrapper for the blobs
    var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function (d, i) { return radarLine(d); })
      .style("fill", function (d, i) { return cfg.color(i); })
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function (d, i) {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);
      })
      .on('mouseout', function () {
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) { return radarLine(d); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function (d, i) { return cfg.color(i); })
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data(function (d, i) { return d; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
      .style("fill", function (d, i, j) { return cfg.color(j); })
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data(function (d, i) { return d; })
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 1.5)
      .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (d, i) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.axis + ": " + Format(d.value))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200)
          .style("opacity", 0);
      });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }//wrap

  }//RadarChart

  remove() {
    d3.select(this.id).select("svg").remove();
  }
}

var comparator = 0;
var data;
function Comparator() {
  if (comparator == 0) {
    comparator = 1;
  }
  else {
    comparator = 0;
  }
}

function drawRadarChart(D) {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
  data = D;



  //Call function to draw the Radar chart
  radar = new RadarChart(".radarChart", data, null);
}


function removeRadar() {
  radar.remove();
  radar = null;
}

function formatN(){
  if (format == 'f'){
    format = '%';
  }
  else {
    format = 'f';
  }
}