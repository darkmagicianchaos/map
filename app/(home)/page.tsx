"use client";

import { AggregatedData } from "@/types";
import { useEffect, useState } from "react";
import Table from "../_components/Table";

export default function Home() {
  const [data, setData] = useState<AggregatedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/turnstile-heatmap.json");
      const jsonData: AggregatedData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center">
        <h1>Transit Data Visualization</h1>
        {data ? <Table data={data} /> : <p>Loading data...</p>}
      </div>
    </main>
  );
}
