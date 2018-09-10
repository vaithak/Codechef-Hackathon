function parseData(data, prevDays)
{
	var countArr = Array.apply(null, Array(prevDays.length)).map(Number.prototype.valueOf,0);
  for (var i in data)
  {
  	for(var j=0; j<prevDays.length; j++)
      {
      	var strDate = formatDate(new Date(data[i]['date'].substr(0,data[i]['date'].indexOf(' '))));

      	if(+(new Date(strDate)) == +(new Date(prevDays[j])) )
          {
          	countArr[j]= countArr[j] + 1;
              break;
          }
      }
  }

  var arr = [];
  for (var i=0; i<prevDays.length; i++) {
      arr.push({
          date: new Date(prevDays[i]),
          value: countArr[i]
      });
  }

  return arr;
}



function formatDate(date){
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd<10) {dd='0'+dd}
    if(mm<10) {mm='0'+mm}
    date = mm+'/'+dd+'/'+yyyy;
    return date
 }


function Last5Days () {
    var result = [];
    for (var i=0; i<5; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push(formatDate(d) )
    }

    return result;
}


function drawLineChart(data) {
var svgWidth = 500, svgHeight = 400;
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([20, width-30]);

var y = d3.scaleOrdinal()
	.domain(data)
    .range([svgHeight-50,0]);


var line = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.value)})
    x.domain(d3.extent(data, function(d) { return d.date }));
    y.domain(d3.extent(data, function(d) { return d.value }));

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain")
    .remove();

g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Problems Solved");

g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}
