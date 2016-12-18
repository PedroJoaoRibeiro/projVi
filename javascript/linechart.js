var chart;
var jog;
class linechart {
    constructor(jogador, atributo) {
        $("#toglesLine").removeClass("hidden");

        this.svg = d3.select("#the_linechart");
        this.doLineChart(jogador, atributo);
    }
    draw(array, jogador, atributo) {
        this.player = jogador;
        var auxyear = array[0].year - 1;

        if (globalType == "player") {
            info.updatePlayerName(jogador.split("\\")[0]);
        }

        var obj = {
            PTS: 0,
            AST: 0,
            TRB: 0,
            DRB: 0,
            STL: 0,
            year: auxyear
        };
        array.unshift(obj);



        var margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        };
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;




        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").tickFormat(d3.format("d"));

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        var valueline = d3.svg.line()
            .x(function (d) {
                return x(d.year);
            })
            .y(function (d) {
                switch (atributo) {
                    case "PTS":
                        return y(d.PTS);
                    case "AST":
                        return y(d.AST);
                    case "TRB":
                        return y(d.TRB);
                    case "DRB":
                        return y(d.DRB);
                    case "STL":
                        return y(d.STL);
                }

            });

        this.svg.selectAll("g")
            .remove();

        var svg = d3.select("#the_linechart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var focus = svg.append("g")
            .style("display", "none");

        var bisectDate = d3.bisector(function (d) { return d.year; }).left,
            formatValue = d3.format("g"),
            formatCurrentValue = function (d, t) {
                var aux;
                if (globalType == "team") {
                    aux = atributo + " In Average Per game";
                }
                else {
                    aux = atributo;
                }
                return  formatValue(d) + " " + aux + " in " + formatValue(t);
            };

        var anoMin = d3.min(array, function (d) {
            return d.year;
        });
        // Scale the range of the data
        x.domain([anoMin, d3.max(array, function (d) {
            return d.year;
        })]);
        y.domain([0, d3.max(array, function (d) {
            switch (atributo) {
                case "PTS":
                    return d.PTS;
                case "AST":
                    return d.AST;
                case "TRB":
                    return d.TRB;
                case "DRB":
                    return d.DRB;
                case "STL":
                    return d.STL;
            }

        }) * 1.25]);

        svg.append("path") // Add the valueline path.
            .attr("d", valueline(array))
            .attr("fill", "none");

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
        focus.append("image")
            .attr("x", -5)
            .attr("y", -5)
            .attr("xlink:href", "data/icons/basketball.png")
            .attr("width", 10)
            .attr("height", 10);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        // append the rectangle to capture mouse               
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", function () {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(array, x0, 1),
                    d0 = array[i - 1],
                    d1 = array[i],
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;

                switch (atributo) {
                    case "PTS":
                        focus.select("image")
                            .attr("transform", "translate(" + x(d.year)  + "," + y(d.PTS)  + ")");
                        focus.select("text").text(formatCurrentValue(d.PTS, d.year));
                        break;
                    case "AST":
                        console.log("estou aqui");
                        focus.select("image")
                            .attr("transform", "translate(" + x(d.year)  + "," + y(d.AST, d.year) + ")");
                        focus.select("text").text(formatCurrentValue(d.AST));
                        break;
                    case "TRB":
                        console.log("estou aqui");
                        focus.select("image")
                            .attr("transform", "translate(" + x(d.year) + "," + y(d.TRB, d.year) + ")");
                        focus.select("text").text(formatCurrentValue(d.TRB));
                        break;
                    case "DRB":
                        console.log("estou aqui");
                        focus.select("image")
                            .attr("transform", "translate(" + x(d.year) + "," + y(d.DRB, d.year) + ")");
                        focus.select("text").text(formatCurrentValue(d.DRB));
                        break;
                    case "STL":
                        console.log("estou aqui");
                        focus.select("image")
                            .attr("transform", "translate(" + x(d.year) + "," + y(d.STL, d.year) + ")");
                        focus.select("text").text(formatCurrentValue(d.STL));
                        break;
                }

            });
    }

    doLineChart(jogador, atributo) {
        var array = [];
        var year = 1950;

        req(array, year, jogador, this, atributo);

    }
}


function req(array, year, jogador, obj, atributo) {
    jog = jogador;
    var file = "";
    if (year >= 2017) {
        fixDataArray(array, year, jogador, atributo, obj);
    }
    else {
        file = getGlobalType(year);
        d3.json(file, function (data) {
            for (var j = 0; j < data.length; j++) {

                if (data[j].Player == jog) {
                    array.push(data[j]);
                }
            }
            req(array, year + 1, jogador, obj, atributo);
        });
    }
}








function lineC(jogador) {
    var atributo = getAtributo();

    if (chart == null) {
        chart = new linechart(jogador, atributo);
    }
    else {
        console.log("aqui");
        chart.doLineChart(jogador, atributo);
    }
}

function updateStat(stat) {
    chart.doLineChart(jog, stat);
}

function getAtributo() {
    if ($('#toggle-PTS').prop('checked')) {
        return "PTS";

    }

    if ($('#toggle-AST').prop('checked')) {
        return "AST";

    }

    if ($('#toggle-TRB').prop('checked')) {
        return "TRB";


    }

    if ($('#toggle-STL').prop('checked')) {
        return "STL";

    }

    if ($('#toggle-DRB').prop('checked')) {
        return "DRB";

    }

}


function fixDataArray(array, year, jogador, atributo, obj){
    var objAux = array[0];
    var arrayAux= [];
    for (var i = 1; i<array.length; i++ ){
        if(objAux.year == array[i].year && objAux.Tm != array[i].Tm){
            objAux.PTS += array[i].PTS;
            objAux.DRB += array[i].DRB;
            objAux.STL += array[i].STL;
            objAux.AST += array[i].AST;
            objAux.TRB += array[i].TRB;
        }
        else{
            arrayAux.push(objAux);
            objAux = array[i];
        }
    }
    obj.draw(arrayAux, jogador, atributo);

}