"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BarChartProps {
  data: number; // The total number of entrances
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      // Clear previous SVG
      d3.select(d3Container.current).selectAll("*").remove();

      const width = 200; // Set width for the bar chart
      const height = 30; // Set height for the bar chart

      // Append SVG object to the container
      const svg = d3
        .select(d3Container.current)
        .attr("width", width*data*0.0001)
        .attr("height", height);

      // Create a scale for your data
      const xScale = d3
        .scaleBand()
        .range([0, width*data*0.0001])
        .domain(["All Entrances"])
        // .padding(0.2);

      const yScale = d3.scaleLinear().domain([0, data]).range([height, 0]);

      // Draw the bar
      svg
        .append("rect")
        .data([data]) // Bind data to the rect
        .attr("x", xScale("All Entrances") ?? 0)
        .attr("y", yScale(data))
        .attr("width", xScale.bandwidth())
        .attr("height", height - yScale(data))
        .attr("fill", "#69b3a2");

      svg.append("text").attr("text-anchor", "start").text(data);
    }
  }, [data]); // Effect dependencies

  return <svg ref={d3Container} />;
};

export default BarChart;
