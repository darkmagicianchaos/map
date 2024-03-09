"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HourlyData {
  hour: number;
  entrances: number;
  exits: number;
}

interface HeatmapProps {
  data: (HourlyData | null)[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "heatmap-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.5)");

    const showTooltip = (event: MouseEvent, d: any) => {
      tooltip
        .style("visibility", "visible")
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`)
        .text(
          `Time: ${d?.hour}, Entrances: ${d?.entrances}, Exits: ${d?.exits}`
        );
    };

    const hideTooltip = () => {
      tooltip.style("visibility", "hidden");
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear the SVG

    const cellWidth = 8;
    const cellHeight = 15;
    const numRows = 2; // Two rows, one for entrances and one for exits
    const numCols = 24;

    // Create color scales
    const maxEntrances = d3.max(data, (d) => (d ? d.entrances : 0));
    const maxExits = d3.max(data, (d) => (d ? d.exits : 0));
    const colorScaleEntrances = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, Number(maxEntrances)]);
    const colorScaleExits = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, Number(maxExits)]);

    // Function to map data to row based on type
    const yPosition = (type: "entrances" | "exits") => {
      return type === "entrances" ? 0 : cellHeight;
    };

    // Append cells for entrances
    svg
      .selectAll(".entrance-cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "entrance-cell")
      .attr("x", (d) => (d ? d.hour : 0) * cellWidth)
      .attr("y", yPosition("entrances"))
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => (d ? colorScaleEntrances(d.entrances) : "#eee"));
    // .attr("stroke", "#ccc");

    // Append cells for exits
    svg
      .selectAll(".exit-cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "exit-cell")
      .attr("x", (d) => (d ? d.hour : 0) * cellWidth)
      .attr("y", yPosition("exits"))
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => (d ? colorScaleExits(d.exits) : "#eee"));
    // .attr("stroke", "#ccc");

    // Set the size of the SVG
    svg.attr("width", numCols * cellWidth).attr("height", numRows * cellHeight);

    svg
      .selectAll("rect")
      .on("mouseover", showTooltip)
      .on("mousemove", showTooltip)
      .on("mouseout", hideTooltip);
  }, [data]); // Redraw when data changes

  return <svg style={{ outline: "1px" }} ref={svgRef}></svg>;
};

export default Heatmap;
