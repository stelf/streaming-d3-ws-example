(function () {
    'use strict'

    const SCOUNT = 30;

    let metrics = new Array(30);

    for (let i = 0; i < 30; i++)
        metrics[i] = [Math.random(), 0, 0];

    let socket = io();

    let svg = d3.select('svg'),
        margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // x() translates from sequence-of-data-point to its position on the chart
    let x = d3.scaleLinear()
        .domain([0, SCOUNT])
        .range([0, width]);

    // t() translates from sequence-of-data-point to time
    let t = d3.scaleTime()
        .domain([new Date(), new Date((new Date()).getTime() + 30 * 1000)])
        .range([0, width]);

    // y() translates from the actual data range to height  [height - value]
    let y = d3.scaleLinear()
        .domain(d3.extent(metrics, d => d[0]))
        .range([height, 0])

    let xAxis = d3.axisBottom(t)
        .ticks(d3.timeSecond.every(1));

    function createChart() {
        let xAxis = d3.axisBottom(t)
            .ticks(d3.timeSecond.every(1));

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y));

        g.selectAll('bar')
            .data(metrics)
            .enter()
            .append('rect')
            .style('fill', 'steelblue')
            .attr('x', (d, i) => x(i))
            .attr('width', width / SCOUNT)
            .attr('y', d => y(d[0]))
            .attr('height', function (d) {
                return height - y(d[0]);
            });
    }

    function updateChart() {
        // update the y() and t() scales according to new data
        y.domain(d3.extent(metrics, d => d[0]));
        t.domain([new Date(), new Date((new Date()).getTime() + 30 * 1000)])

        // update the axis text (time)
        g.selectAll('g.axis--x')
            .call(xAxis);

        // update the bars to have 'y' and 'height' correspodning to the new data
        g.selectAll('rect')
            .data(metrics)
            .transition(1000)
            .attr('height', function (d) {
                return height - y(d[0]);
            })
            .attr('y', d => y(d[0]));
    }

    createChart();

    socket.on('metric', function (m) {
        metrics.unshift(m);

        if (metrics.length > SCOUNT) {
            metrics.pop();
        }

        updateChart();
    })

    console.log('app initiated')
})();