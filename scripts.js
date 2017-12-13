	
d3.csv('data.csv', function(data) {
	// makeChart(d)

	d3.selectAll('.chart-container').each(function(d) {
		var _this = d3.select(this)
		var team = _this.attr('data-team')
		var seasons = _this.attr('data-season').split(',')
		console.debug(seasons)
		makeSmallChart(data, team, this, seasons)
	})
})

function makeSmallChart(data, team, div, seasons) {
	// console.log(data)
	var filteredData = data
	var filteredData = data.filter(function(elem) {
		return elem['Tm'] === team && elem['Season'] != "2017-18"
	})

	var margin = {
		'top' : 20,
		'bottom' : 20,
		'left' : 30,
		'right' : 20,
	}

	var width = 600 - margin.left - margin.right
	var height = 560 - margin.top - margin.bottom

	var chartWidth = width-margin.left-margin.right
	var chartHeight = height-margin.top-margin.bottom
	
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

	chartInner.append('g')
		.attr('transform','translate(0,'+(chartHeight+10)+')')
		.call(
			d3.axisBottom()
				.scale(xScale)
				.tickSize(-chartHeight-10)
		)

	var line = d3.line()
		.x(function(d) {
			return xScale(parseInt(d['3PA']))
		})
		.y(function(d) {
			return yScale(parseFloat(d['W/L%']))
		})


	var colorScale = d3.scaleLinear()
		.domain([1979,2016])
		.range(['#eee','#a00'])

	var path = chartInner.append('path')
		.datum(filteredData)
		.attr('class', 'path')
		.attr('d', line)

	var dots = chartInner.selectAll('circle')
		.data(filteredData)
		.enter()
		.append('circle')
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

	var SeasonsToHighlight = filteredData.filter(function(d) {
		return seasons.indexOf(d['Season']) !== -1
	})

	var labels = chartInner.append('g').selectAll('circle')
		.data(SeasonsToHighlight)
		.enter().append('circle')
		.attr('class','highlight-circle')
		.attr('cx', function(d) {
			return xScale(parseInt(d['3PA']))
		})
		.attr('cy', function(d) {
			return yScale(parseFloat(d['W/L%']))
		})
		.attr('r', 4)


	// console.debug(SeasonsToHighlight)
}