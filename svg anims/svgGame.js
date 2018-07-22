window.onload = function() {

    
    let width = window.innerWidth - 40,
    height = window.innerHeight - 40;
    
    
    // const d3 = require('./lib/d3.v5');
    
    const getTransform = (x, y, ang=0, scale=1) => `translate(${x} ${y})` + `rotate(${ang})` + `scale(${scale})`;
    function boidG(parent){
        let size = 100;
        let g = parent.append('g'); // make it a group
        // body
        g.append('polygon')
            // .classed('body', true)
            .attr('transform', getTransform(100, 100, 100, size))
            .attr('points', '0,-1 1,1 0.5,1 0,0.75 -0.5,1 -1,1')
            .attr('fill', 'green')
            .attr('stroke', 'black')
            .attr('stroke-width', size / 10000);
        // // eye
        // let eye = g.append('g')
        //     // .classed('eye', true);
        // // eye white
        // eye.append('circle')
        //     // .classed('eyeWhite', true)
        //     .attrs({cx: 0, cy: 0, r: 1/3, fill: 'white', stroke: 'black', 'stroke-width': 0.05});
        // eye.append('circle')
        //     // .classed('eyeBlack', true)
        //     .attrs({r: 1/5, fill: 'black'});
        // // return the group
        return g;
    }
    function customPath() {
        //The data for our line
        var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                         { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                         { "x": 80,  "y": 5},  { "x": 100, "y": 60}];
 
        //This is the accessor function we talked about above
        var lineFunction = d3.svg.line()
                               .x(function(d) { return d.x; })
                               .y(function(d) { return d.y; })
                               .interpolate("linear");
    }
    function makeHatchet(svg, x, y, size=30) {
        let g = svg.append('g').attr('transform', getTransform(x, y, 0, size));
        // let g = d3.g();
        
        // g.append('circle')
        //     .attrs({'fill':'red', 'r':1, 'dx':0, 'dy':0});
        // body
        g.append('polygon')
            // .classed('body', true)
            .attr('points', `-0.1,-0.2
                             -0.7,-0.2
                             -0.85,-0.55,
                             0.8,-0.55
                             0.8,0.9
                             -0.1,0.8`)
            .attr('fill', '#555555')
            .attr('stroke', 'black')
            .attr('stroke-width', size / 10000);
            
        g.append('circle')
            .attrs({'fill':'cyan', 'r':0.15, 'cx':-0.35, 'cy':0.05})//.attrs({'stroke':'black', 'stroke-width': size/10000});
            
        g.append('circle')
            .attrs({'fill':'cyan', 'r':0.15, 'cx':-0.35, 'cy':0.55})//.attrs({'stroke':'black', 'stroke-width': size/10000});
                

        return g;
    }
    function flameAnim(svg, x, y) {
        // release 20 flamelets that go from a small white circle
        //                                to a medium yellow one
        //                                to a small red one again
        for(let i=0; i<20; i++){
            svg.append('circle')
                .attrs({'cx': x, 'cy': y, 'r': 0, 'fill': 'white'})
                .transition()
                    .delay(i * 50)
                    .duration(500)
                    .attr('cx', x + Math.random() * 25 - 10)
                    .attr('cy', y + Math.random() * 25 - 10)
                    .attrs({'r': 10, 'fill': 'yellow'})
                    .style('opacity', 1)
                .transition()
                    .duration(1000)
                    .attr('cx', x + Math.random() * 25 - 10)
                    .attr('cy', y - Math.random() * 100 - 50)
                    .attrs({'r': 5, 'fill': 'red'})
                    .style('opacity', 0)
                    .remove();
        }
    }
    function boomAnim(svg, x, y, size, duration=500) {
        let sparks = 10;
        let radius = size * 0.7;
        svg.append('ellipse')
            .attrs({'cx': x, 'cy': y, 'rx': 0.1 * size, 'ry': 0.05 * size, 'fill': 'white'})
            .transition()
                .duration(duration)
                .attrs({'rx': size, 'ry': size/6})
                .style('opacity', 0)
                .remove();
        for(let i=0; i<sparks; i++){
            let delay = i * duration / sparks / 5;
            // let sparkDur = duration - i * duration / sparks;
            svg.append('circle')
                .attrs({'cx': x, 'cy': y, 'r': 0, 'fill': 'white'})
                .transition()
                    .delay(delay)
                    .duration(duration - delay)
                    .attr('cx', x + Math.random() * radius - radius/2)
                    .attr('cy', y + Math.random() * radius - radius/2)
                    .attrs({'r': 0.3 * size, 'fill': 'orange'})
                    .style('opacity', 0)
                    .remove();
        }
    }
    // add a svg
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    // update mouse XY on mouse move
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'black');

    makeHatchet(svg, 210, 90, 40);
    makeHatchet(svg, 140, 500, 40);
    makeHatchet(svg, 300, 120, 40);
    let drone = makeHatchet(svg, 100, 100, 40);
    // flame(svg, 200, 200);
    drone.transition()
        .duration(400)
        .attr('transform', getTransform(1000, 400, 0, 40))
        .on('end', () => boomAnim(svg, 1000, 400, 40));
        // .each('start', function(d) {console.log('start', d); flame(svg, 10, 10)})
        // .each('end', function(d) {console.log('end', d); flame(svg, 10, 10)});
    let sim = {
        width: width,
        height: height,
        svg: svg
    }
    console.log(sim);
    d3.interval(() => boomAnim(svg, Math.random() * width, Math.random() * height, 50 + Math.random() * 200, 500), 300);
}