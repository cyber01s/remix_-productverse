import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadarChartProps {
  data: {
    label: string;
    values: Record<string, number>;
  }[];
  dimensions: string[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, dimensions }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 400;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / dimensions.length;

    // Scale for the radius
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 100]);

    // Grid circles
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      g.selectAll('.levels')
        .data(dimensions)
        .enter()
        .append('line')
        .attr('x1', (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('y1', (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('x2', (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
        .attr('y2', (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
        .style('stroke', '#e5e7eb')
        .style('stroke-width', '0.5px');
    }

    // Axes
    const axis = g.selectAll('.axis')
      .data(dimensions)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', '#e5e7eb')
      .style('stroke-width', '1px');

    axis.append('text')
      .attr('class', 'legend')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d);

    // Data areas
    const radarLine = d3.lineRadial<{axis: string, value: number}>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    data.forEach((d, idx) => {
      const radarData = dimensions.map(axis => ({
        axis,
        value: d.values[axis] || 0
      }));

      g.append('path')
        .datum(radarData)
        .attr('d', radarLine)
        .style('fill', colors[idx % colors.length])
        .style('fill-opacity', 0.1)
        .style('stroke', colors[idx % colors.length])
        .style('stroke-width', '2px');
        
      g.selectAll('.radarCircle')
        .data(radarData)
        .enter()
        .append('circle')
        .attr('class', 'radarCircle')
        .attr('r', 3)
        .attr('cx', (rd, i) => rScale(rd.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('cy', (rd, i) => rScale(rd.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style('fill', colors[idx % colors.length]);
    });

  }, [data, dimensions]);

  return (
    <div className="flex justify-center items-center">
      <svg ref={svgRef} width="400" height="400" />
    </div>
  );
};
