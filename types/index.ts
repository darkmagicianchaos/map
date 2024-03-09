// Define a single time entry with relevant fields
export interface TimeEntry {
  time: number;
  hour: number;
  day: number;
  week: number;
  entrances: number;
  exits: number;
  i: number;
}

// Interface for aggregated data including max, min, mean, etc.
export interface AggregatedData {
  max: number;
  min: number;
  mean: number;
  stops: Stop[];
}
export interface TimeEntry {
  time: number;
  hour: number;
  day: number;
  week: number;
  entrances: number;
  exits: number;
  i: number;
}

// Interface for aggregated data including max, min, mean, etc.
export interface AggregatedData {
  max: number;
  min: number;
  mean: number;
  numberOfEntries: number;
  all: {
    max: number;
    min: number;
    entrancesByType: {
      offpeak: number;
      all: number;
      weekday: number;
    };
    times: TimeEntry[];
  };
  stops: Stop[];
  totalEntrances: number;
  totalExits: number;
}

export interface HourlyData {
  hour: number;
  entrances: number;
  exits: number;
}

export interface HeatmapProps {
  data: (HourlyData | null)[];
}

export interface Stop {
  name: string;
  averagesByType: {
    offpeak: (HourlyData | null)[];
    weekday: (HourlyData | null)[];
  };
  entrancesByType: {
    offpeak: number;
    all: number;
    weekday: number;
  };
  times: TimeEntry[];
  // Include other fields as necessary
}

export interface TurnstileData {
  aggregatedData: AggregatedData;
}

export interface TableProps {
  data: AggregatedData; // Assuming AggregatedData includes the stops array
}
