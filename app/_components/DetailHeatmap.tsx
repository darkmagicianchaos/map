"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface TimeEntry {
  hour: number;
  week: number;
  entrances: number;
  exits: number;
}

interface DetailHeatmapProps {
  times: (TimeEntry | null)[];
}

const DetailHeatmap: React.FC<DetailHeatmapProps> = ({ times }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const dayGroups = 7;
      const hoursPerDay = 24;
      const cellWidth = 5;
      const cellHeight = 8;
      const padding = 15;
      const dayPadding = 10;
      const groupHeight = 2;
      const width = hoursPerDay * cellWidth + (dayGroups - 1) * dayPadding;
      const height = dayGroups * groupHeight + (dayGroups - 1) * padding;

      svg.attr("width", width).attr("height", height);

      const entranceGroup = svg.append("g").attr("id", "entrances");
      const exitGroup = svg.append("g").attr("id", "exits");

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("border", "1px solid #000")
        .style("padding", "5px");

      let groupedByWeekDay = Array.from({ length: 4 }, () =>
        Array.from({ length: 7 }, () => Array(24).fill(null))
      );

      times.forEach((d: any) => {
        if (d) {
          groupedByWeekDay[d.week - 1][d.day][d.hour] = d;
        }
      });

      const maxEntrance = d3.max(times, (d) => d?.entrances) || 0;
      const maxExit = d3.max(times, (d) => d?.exits) || 0;
      const colorScaleEntrances = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, maxEntrance]);
      const colorScaleExits = d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, maxExit]);

      const startX = cellHeight;
      const startY = hoursPerDay + dayGroups + dayPadding;
      const weekHeight = dayPadding;

      const spacePerDay = 5;

      svg
        .append("text")
        .attr("x", 30)
        .attr("y", startX)
        .attr("text-anchor", "end")
        .style("font-size", "8px")
        .text("Week");

      groupedByWeekDay.forEach((week, weekIdx) => {
        const yEntrance = startX + weekIdx * weekHeight;
        const yExit = yEntrance + cellHeight * 4 + 10;

        svg
          .append("text")
          .attr("x", 30)
          .attr("y", yEntrance + startX)
          .attr("text-anchor", "end")
          .style("font-size", "8px")
          .text(weekIdx);

        svg
          .append("text")
          .attr("x", 30)
          .attr("y", yExit + startX)
          .attr("text-anchor", "end")
          .style("font-size", "8px")
          .text(weekIdx);

        week.forEach((day, dayIdx) => {
          day.forEach((hourEntry, hourIdx) => {
            // Only draw if there's data
            if (hourEntry) {
              const dayStartX =
                startX + 30 + dayIdx * (24 * cellWidth + spacePerDay);
              const x = dayStartX + hourIdx * cellWidth;

              // Draw entrances
              entranceGroup
                .append("rect")
                .attr("x", x)
                .attr("y", yEntrance + 3)
                .attr("width", cellWidth)
                .attr("height", cellHeight)
                .attr("fill", colorScaleEntrances(hourEntry.entrances))
                .on("mouseover", (event) => {
                  tooltip
                    .style("visibility", "visible")
                    .html(
                      `Hour: ${hourEntry.hour}, Day: ${hourEntry.day}, Week: ${hourEntry.week}<br/>Entrances: ${hourEntry.entrances}`
                    )
                    .style("top", `${event.pageY}px`)
                    .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", () => tooltip.style("visibility", "hidden"));

              // Draw exits
              exitGroup
                .append("rect")
                .attr("x", x)
                .attr("y", yExit + 3)
                .attr("width", cellWidth)
                .attr("height", cellHeight)
                .attr("fill", colorScaleExits(hourEntry.exits))
                .on("mouseover", (event) => {
                  tooltip
                    .style("visibility", "visible")
                    .html(
                      `Hour: ${hourEntry.hour}, Day: ${hourEntry.day}, Week: ${hourEntry.week}<br/>Exits: ${hourEntry.exits}`
                    )
                    .style("top", `${event.pageY}px`)
                    .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", () => tooltip.style("visibility", "hidden"));

              if (hourIdx === 6 || hourIdx === 12 || hourIdx === 18) {
                const hour = hourIdx === 18 ? hourIdx / 3 : hourIdx;

                svg
                  .append("text")
                  .attr("x", x + hourIdx)
                  .attr("y", startX)
                  .attr("text-anchor", "end")
                  .style("font-size", "7px")
                  .text(hourIdx < 10 ? `${hour}am` : `${hour}pm`);
              }
            }
          });
        });
      });
      const adjustedWidth =
        dayGroups * 24 * cellWidth + (dayGroups - 1) * spacePerDay;

      svg
        .attr("width", adjustedWidth + startY)
        .attr("height", weekHeight * 4 * 2 + weekHeight * 2);
    }
  }, [times]);

  return <svg ref={svgRef} />;
};

export default DetailHeatmap;
