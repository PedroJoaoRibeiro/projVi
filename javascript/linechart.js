var chart;
class linechart {
    constructor(jogador){
         this.svg = d3.select("#the_linechart");
         this.doLineChart(jogador);
    }
    draw(array, year, jogador){
        var margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        };
        var width = 600 - margin.left - margin.right;
        var height = 270 - margin.top - margin.bottom;




        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5).tickFormat(d3.format("d"));

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        var valueline = d3.svg.line()
            .x(function (d) {
            return x(d.year);
            })
            .y(function (d) {
            return y(d.PTS);
            });

        var svg = d3.select("#the_linechart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var focus = svg.append("g")                         
            .style("display", "none");
            
        var bisectDate = d3.bisector(function(d) { return d.year; }).left,
            formatValue = d3.format("d"),
            formatCurrentValue = function(d) { return formatValue(d) + " PTS" ; };

        var anoMin = d3.min(array, function (d) {
            return d.year;
            });
        // Scale the range of the data
        x.domain([anoMin,d3.max(array, function (d) {
            return d.year;
            })]);
        y.domain([0, d3.max(array, function (d) {
            return d.PTS;
            })]);

        svg.append("path") // Add the valueline path.
            .attr("d", valueline(array));

        svg.append("g") // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g") // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis);
        /* .append("text")                           Legenda do eixo
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");*/



                // append the circle at the intersection               
        focus.append("circle")                                 
            .attr("class", "y")                                
            .style("fill", "none")                             
            .style("stroke", "blue")                           
            .attr("r", 4);
        
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");                                 
        
        // append the rectangle to capture mouse               
        svg.append("rect")                                     
            .attr("width", width)                              
            .attr("height", height)                            
            .style("fill", "none")                             
            .style("pointer-events", "all")                    
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", function(){                        
                                        var x0 = x.invert(d3.mouse(this)[0]),            
                                            i = bisectDate(array, x0, 1),                 
                                            d0 = array[i - 1],                             
                                            d1 = array[i],                                  
                                            d = x0 - d0.year > d1.year - x0 ? d1 : d0;    
                                                

                                        focus.select("circle.y")                      
                                            .attr("transform","translate(" + x(d.year) + "," + y(d.PTS) + ")"); 
                                        focus.select("text").text( formatCurrentValue(d.PTS));      
                                });  
    }

    doLineChart(jogador) {
        var array = [];
        var year = 1950; 
        
        req (array,year, jogador, this);

    }
}


function req(array, year, jogador, obj) {

    var file = "";
    if (year >= 2017){
    
        obj.draw (array, year, jogador);



    }
    else{
        file = "data/Jogadores_VI/playoffs/" + year + ".json";
        d3.json(file, function (data) {
            for (var j = 0; j < data.length; j++) {

                if (data[j].Player == jogador) {
                    array.push(data[j]);
                }  
            }
            req(array, year + 1, jogador, obj); 
        });
    }
}

                                                    






function lineC(jogador){
    if (chart == null){
        chart = new linechart(jogador);
    }
    else{
        console.log("aqui");
        chart.doLineChart(jogador);
    }
}