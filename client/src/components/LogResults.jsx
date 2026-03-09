// pages/LogResults.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLogById } from "../api/file.api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles/LogResults.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const LogResults = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
  const fetchLog = async () => {
    try {
      const res = await getLogById(id);
      setAnalysis(res.data.analysis);
    console.log(res.data);

    } catch (err) {
      console.error("Failed to fetch log", err);
    }

  };

  fetchLog();
}, [id]);

  if (!analysis) {
  return <h2 className="loader">Analyzing Logs...</h2>;
}

  const errorChart = {
  labels: analysis?.topErrors?.map((e) => e.type) || [],
  datasets: [
    {
      label: "Error Count",
      data: analysis?.topErrors?.map((e) => e.count) || [],
    },
  ],
};

  const timeChart = {
  labels: analysis?.timeRanges?.map((t) => t.range) || [],
  datasets: [
    {
      label: "Errors by Time",
      data: analysis?.timeRanges?.map((t) => t.count) || [],
    },
  ],

  
};

const downloadFullReport = () => {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Log File Intelligence Report", 14, 20);

  pdf.setFontSize(12);
  pdf.text(`Total Errors: ${analysis.errorFrequency}`, 14, 35);
  pdf.text(`Most Frequent Time Range: ${analysis.mostFrequentTimeRange}`, 14, 45);

  const errorRows = analysis.topErrors.map(e => [e.type, e.count]);

  autoTable(pdf, {
    startY: 60,
    head: [["Error Type", "Count"]],
    body: errorRows,
  });

  const timeRows = analysis.timeRanges.map(t => [t.range, t.count]);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 10,
    head: [["Time Range", "Errors"]],
    body: timeRows,
  });

  pdf.save("log-analysis-report.pdf");
};

const exportCSV = () => {
  let csv = "Error Type,Count\n";

  analysis.topErrors.forEach(e => {
    csv += `${e.type},${e.count}\n`;
  });

  csv += "\nTime Range,Errors\n";

  analysis.timeRanges.forEach(t => {
    csv += `${t.range},${t.count}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "log-analysis.csv";
  link.click();
};

const shareReport = async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Log Analysis Report",
      text: "Check out this log analysis report",
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied to clipboard");
  }
};


  return (
    <div className="results-page">

      <h1>Log Analysis Report</h1>

      <div className="stats-grid">

  <div className="stat-card">
    <h4>Total Errors</h4>
    <p>{analysis.errorFrequency}</p>
  </div>

  <div className="stat-card">
    <h4>Most Frequent Time</h4>
    <p>{analysis.mostFrequentTimeRange}</p>
  </div>

  <div className="stat-card">
    <h4>Unique Error Types</h4>
    <p>{analysis.topErrors.length}</p>
  </div>

</div>

      {/* Error Frequency */}
      <div className="chart-card">
        <h3>Top Error Types</h3>
        <Bar data={errorChart} className="pb-6"/>
      </div>

      {/* Time Distribution */}
      <div className="chart-card">
        <h3>Error Distribution by Time</h3>
        <Bar data={timeChart} />
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h3>Summary</h3>
        <p>Total Errors: {analysis.errorFrequency}</p>
<p>Most Frequent Time Range: {analysis.mostFrequentTimeRange}</p>
      </div>
    
    {/* Actions */}
    <div className="actions">
        <button className="mt-6" onClick={shareReport}>Share Report</button>
        <button className="mt-6" onClick={exportCSV}>
Export CSV
</button>
      <button className="mt-6" onClick={downloadFullReport}>Download Report</button>
    </div>
      
    </div>
  );
};

export default LogResults;