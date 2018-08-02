<template>
    <div class="container">
        <h1>Learned Coefficients: a - {{res[0]}}, b - {{res[1]}}</h1>
        <svg :width="width" :height="height" id="svg">
            <g :width="width - 2 * margin.left" :height="height - 2 * margin.top" id="plotGroup"></g>
        </svg>
    </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import { generateData } from './data'
import { train } from './train'
const d3 = require('d3')

export default {
    data: function() {
        return {
            width: 600, 
            height: 400,
            margin: { top: 50, left: 50 },
            res: []
        };
    },
    mounted: function() {
        const range = 1;
        const data = generateData(range, 100, { a: 2, b: 1 });
        this.res = train(data.xs, data.ys).map(d => d.dataSync()[0]);
        console.log(this.res);
        const lineData = [{ x: 0, y: this.res[1] }, { x: range, y: range * this.res[0] + this.res[1] }];
        const xv = data.xs.dataSync(), yv = data.ys.dataSync(), parsedData = [];
        const plotWidth = this.width - 2 * this.margin.left, plotHeight = this.height - 2 * this.margin.top;

        for (var i = 0; i < xv.length; i++)
            parsedData.push({ x: xv[i], y: yv[i] });

        let plotGroup = d3.select('#plotGroup').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        let x = d3.scaleLinear().range([0, plotWidth]);
        let y = d3.scaleLinear().range([plotHeight, 0]);
        let line = d3.line().x(d => x(d.x)).y(d => y(d.y));

        x.domain(d3.extent(lineData, d => d.x)).nice();
        y.domain(d3.extent(lineData, d => d.y)).nice();

        let dataBound = plotGroup.append('g').selectAll('.point').data(parsedData);
        dataBound.exit().remove();

        let enterSelection = dataBound.enter().append('g').classed('point', true);
        enterSelection.merge(dataBound).attr('transform', (d, i) => `translate(${x(d.x)},${y(d.y)})`);
        enterSelection.append('circle').attr('r', 2).style('fill', 'red');

        plotGroup.append('path').data([lineData]).classed('line', true).attr('d', line);

        plotGroup.append('g').attr('transform', `translate(${0}, ${plotHeight})`).call(d3.axisBottom(x));
        plotGroup.append('g').call(d3.axisLeft(y));
    },
}
</script>

<style>
.line {
    fill: none;
    stroke: green;
    stroke-width: 2px;
}

svg {
    border: 3px solid black;
}
</style>
