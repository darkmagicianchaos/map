"use client";

import React, { useState } from "react";
import Heatmap from "./Heatmap";
import BarChart from "./BarChart";
import DetailHeatmap from "./DetailHeatmap";
import { Stop, TableProps } from "@/types";

const Table: React.FC<TableProps> = ({ data }) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(
    null
  );

  const handleRowClick = (index: number) => {
    selectedStopIndex !== index
      ? setSelectedStopIndex(index)
      : setSelectedStopIndex(null);
  };

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Avg. Weekend</th>
          <th>Avg. Weekday</th>
          <th>Avg. Entries (Bar Chart)</th>
        </tr>
      </thead>
      <tbody>
        {data.stops.map((stop: Stop, index: number) => {
          return (
            <React.Fragment key={index}>
              <tr onClick={() => handleRowClick(index)}>
                <td>{stop.name}</td>
                <td>
                  <Heatmap data={stop.averagesByType.offpeak} />
                </td>
                <td>
                  <Heatmap data={stop.averagesByType.weekday} />
                </td>
                <td>
                  <BarChart data={stop.entrancesByType.all} />
                </td>
              </tr>
              {selectedStopIndex === index && (
                <tr>
                  <td colSpan={4}>
                    <DetailHeatmap times={data.stops[index].times} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
