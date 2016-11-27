var data1 = [
  {
    className: 'germany', // optional can be used for styling
    axes: [
      {axis: "strength", value: 13},
      {axis: "intelligence", value: 6},
      {axis: "charisma", value: 5},  
      {axis: "dexterity", value: 9},  
      {axis: "luck", value: 2}
    ]
  },
  {
    className: 'argentina',
    axes: [
      {axis: "strength", value: 6},
      {axis: "intelligence", value: 7},
      {axis: "charisma", value: 10},  
      {axis: "dexterity", value: 13},  
      {axis: "luck", value: 9}
    ]
  }
];
 
/*RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 3;
RadarChart.defaultConfig.w = 400;
RadarChart.defaultConfig.h = 400;
var chart = RadarChart.chart();
var cfg = chart.config(); // retrieve default config
var svg = d3.select('the_starPlot').append('svg')
  .attr('width', cfg.w + cfg.w + 50)
  .attr('height', cfg.h + cfg.h / 4);
svg.append('g').classed('single', 1).datum(data1).call(chart);*/
RadarChart.draw(".the_starPlot", data1);
