var winners = [
	'2016-17-GSW',
	'2015-16-CLE',
	'2014-15-GSW',
	'2013-14-SAS',
	'2012-13-MIA',
	'2011-12-MIA',
	'2010-11-DAL',
	'2009-10-LAL',
	'2008-09-LAL',
	'2007-08-BOS',
	'2006-07-SAS',
	'2005-06-MIA',
	'2004-05-SAS',
	'2003-04-DET',
	'2002-03-SAS',
	'2001-02-LAL',
	'2000-01-LAL',
	'1999-00-LAL',
	'1998-99-SAS',
	'1997-98-CHI',
	'1996-97-CHI',
	'1995-96-CHI',
	'1994-95-HOU',
	'1993-94-HOU',
	'1992-93-CHI',
	'1991-92-CHI',
	'1990-91-CHI',
	'1989-90-DET',
	'1988-89-DET',
	'1987-88-LAL',
	'1986-87-LAL',
	'1985-86-BOS',
	'1984-85-LAL',
	'1983-84-BOS',
	'1982-83-PHI',
	'1981-82-LAL',
	'1980-81-BOS',
	'1979-80-LAL',
]

d3.csv('data.csv', function(data) {
	// makeChart(d)

	makeBigChart(data,'#big-chart')
})

function makeBigChart(data,div) {
	console.log(data)
	var filteredData = data
	var filteredData = data.filter(function(elem) {
		return elem['Season'] != "2017-18"
	})

	var margin = {
		'top' : 20,
		'bottom' : 60,
		'left' : 60,
		'right' : 20,
	}

	var width = 900 - margin.left - margin.right
	var height = 860 - margin.top - margin.bottom

	var chartWidth = width-margin.left-margin.right
	var chartHeight = height-margin.top-margin.bottom
	console.debug('yes')
	var svg = d3.select(div).append('svg')
		.attr('width', width)
		.attr('height', height)

	var chartInner = svg.append('g')
		.attr('transform', 'translate('+margin.left+','+margin.top+')')

	var yScale = d3.scaleLinear()
		.domain([0,1])
		.range([chartHeight, 0])

	var xScale = d3.scaleLinear()
		.domain([0,3500])
		.range([0, chartWidth])

	chartInner.append('g').attr('transform','translate(-10,0)')
		.call(
			d3.axisLeft()
				.scale(yScale)
				.tickSize(-chartWidth-10)
		)
	chartInner.append("text")
	  .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Winning Percentage");




	chartInner.append('g')
		.attr('transform','translate(0,'+(chartHeight+10)+')')
		.call(
			d3.axisBottom()
				.scale(xScale)
				.tickSize(-chartHeight-10)
		)

	chartInner.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," +  (chartHeight+45) + ")")
      .style("text-anchor", "middle")
      .text("Three-Pointers Attempted")
      .style("font-family", "Helvetica");

	var colorScale = d3.scaleLinear()
		.domain([1979,2016])
		.range(['#eee','#a00'])

	var dots = chartInner.selectAll('circle')
		.data(filteredData)
		.enter().append('circle')
		.attr('r', 3)
		.attr('cx', function(d) {
			return xScale(parseInt(d['3PA']))
		})
		.attr('cy', function(d) {
			return yScale(parseFloat(d['W/L%']))
		})
		.attr('fill', function(d) {
			return colorScale(parseInt(d['Season'].split('-')[0]))
		})
		.each(function(d) {
			if ( winners.indexOf(d['Season']+'-'+d['Tm']) != -1) {
				d3.select(this).classed('is-ship-winner',true)
				console.debug('YAY')
			}
		})

	var tooltip = chartInner.append('text')
		.attr('class', 'tooltip')

	dots.on('mouseover', function(d) {
		console.log(d.Tm, d.Season)
	 	var _this = d3.select(this)
	 	
	 	tooltip.attr('x', _this.attr('cx'))
	 		.attr('y', _this.attr('cy') - 10)
	 		.text(d.Tm+', '+d.Season)
	 		.classed('active', true)

	 	//   .attr("fill","red");
		
	})
.on('mouseleave', function(d) {
	tooltip.classed('active', false)
})

}