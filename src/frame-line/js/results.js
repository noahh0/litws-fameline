(function (exports) {
    const PAGE_CONTENT_WIDTH = document.getElementById('content').offsetWidth;
    const MAX_GRAPH_WIDTH = 900;
    const MAX_GRAPH_HEIGHT = 400;
    const MAX_SCORE = 100;
    // Declare the chart dimensions and margins.
    const height = MAX_GRAPH_HEIGHT;
    const barHeight = height/10;
    const MARGIN = barHeight;
    const width = Math.min(PAGE_CONTENT_WIDTH, MAX_GRAPH_WIDTH)-(2*MARGIN);
    let svg = null;
    let lastMarkCoordinate = null;

    //TODO: This only works for two sequencial points.
    // We need to implement a check for multiple points
    let _isTooClose = function (mark1_x, mark2_x) {
        let dist = Math.abs(mark1_x-mark2_x);
        return dist < (2.5*barHeight);
    }

    let _calculateMarkX = function (score) {
        return (width/MAX_SCORE*score)+MARGIN;
    }
    let _addMark = function (context){
        context.moveTo(barHeight/2,barHeight)
        context.lineTo(0,0)
        context.lineTo(barHeight, 0)
        context.closePath()
        return context
    }

    let drawMark = function(score, legend, fill= false) {
        let mark_x = _calculateMarkX(score);
        let mark_y = height/2-(3/2*barHeight);
        let tooClose = false;
        if(lastMarkCoordinate && _isTooClose(mark_x, lastMarkCoordinate.x)){
            tooClose = true;
        }

        let mark = svg.append("g");
        let fill_color = !fill ? "none" : "black";
        mark.append("path")
            .style("stroke", "black")
            .style("fill", fill_color)
            .attr('d', _addMark(d3.path()))
        mark.append("text")
            .attr('x', barHeight/2)
            .attr('y', tooClose ? -(barHeight/2) : -(barHeight/10) )
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5em')
            .text(legend)

        lastMarkCoordinate = {x: mark_x, y: mark_y};
        mark.attr('transform', `translate(${mark_x}, ${mark_y})`);
    }
    let draw = function(divID) {
        // Create the SVG container.
        svg = d3.select(`#${divID}`)
            .append("svg")
            .attr("width", width+(2*MARGIN))
            .attr("height", height);

        // Add bar
        let bar = svg.append("g");
        bar.append("rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', barHeight)
            .attr('stroke', 'black')
            .attr('fill', '#6A9341')
        bar.append("text")
            .attr('x', 0)
            .attr('y', barHeight*2)
            .text($.i18n('study-fl-results-graphic-legend-1'))
        bar.append("text")
            .attr('x', width)
            .attr('y', barHeight*2)
            .attr('text-anchor', 'end')
            .text($.i18n('study-fl-results-graphic-legend-2'))
        bar.attr('transform', `translate(${MARGIN}, ${height/2-(barHeight/2)})`);
    }

    exports.results = {};
    exports.results.drawGraphic = draw;
    exports.results.drawMark = drawMark;

})( window.LITW = window.LITW || {} );