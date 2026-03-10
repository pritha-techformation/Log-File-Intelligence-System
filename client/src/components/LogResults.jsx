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

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

// Log Results Component 
const LogResults = () => {
  // Get log id from url
  const { id } = useParams();
  // States
  const [analysis, setAnalysis] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial render
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch log
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

  // Render loading indicator
  if (!analysis) {
    return <h2 className="loader">Analyzing Logs...</h2>;
  }

  // Error Charts
  const errorChart = {
    labels: analysis?.topErrors?.map((e) => e.type) || [],
    datasets: [
      {
        label: "Error Count",
        data: analysis?.topErrors?.map((e) => e.count) || [],
      },
    ],
  };

  // Time Charts
  const timeChart = {
    labels: analysis?.timeRanges?.map((t) => t.range) || [],
    datasets: [
      {
        label: "Errors by Time",
        data: analysis?.timeRanges?.map((t) => t.count) || [],
      },
    ],
  };

  // Download Full Report
  const downloadFullReport = () => {
  const pdf = new jsPDF();

  // Header
  pdf.setFontSize(18);
  pdf.text("Log File Intelligence Report", 14, 20);

  // Analysis
  pdf.setFontSize(12);
  pdf.text(`Total Errors: ${analysis.errorFrequency}`, 14, 35);
  pdf.text(
    `Most Frequent Time Range: ${analysis.mostFrequentTimeRange}`,
    14,
    45
  );

  // Error Table
  const errorRows = analysis.topErrors.map((e) => [e.type, e.count]);

  // Generate table
  autoTable(pdf, {
    startY: 60,
    head: [["Error Type", "Count"]],
    body: errorRows,
  });

  // Time Table
  const timeRows = analysis.timeRanges.map((t) => [t.range, t.count]);

  // Generate table
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 10,
    head: [["Time Range", "Errors"]],
    body: timeRows,
  });

  // Save PDF
  pdf.save("log-analysis-report.pdf");
};

// Download CSV
  const exportCSV = () => {
  let csv = "Error Type,Count\n";

  // Generate CSV
  analysis.topErrors.forEach((e) => {
    csv += `${e.type},${e.count}\n`;
  });

  // Time Range
  csv += "\nTime Range,Errors\n";

  // Generate CSV for time ranges
  analysis.timeRanges.forEach((t) => {
    csv += `${t.range},${t.count}\n`;
  });

  // Download CSV

  // Create Blob
  const blob = new Blob([csv], { type: "text/csv" });

  // Create download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "log-analysis.csv";
  link.click();
};



  return (
    <div className="results-page">
      <h1>Log Analysis Report</h1>

      {/* Stats */}
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
        {isMobile ? (
        <Pie data={errorChart} />
      ) : (
        <Bar data={errorChart} className="xl:pb-6" />
      )}
      </div>
      

      {/* Time Distribution */}
      <div className="chart-card">
        <h3>Error Distribution by Time</h3>
        <Bar data={timeChart} className="xl:pb-6"/>
      </div>

      {/* Error Logs */}
      <div className="errors-card">
        <h3>Detected Errors</h3>

        {analysis.errors && analysis.errors.length > 0 ? (
          <div className="error-list">
            {analysis.errors.slice(0, 20).map((error, index) => (
              <div key={index} className="error-item">
                {error}
              </div>
            ))}
          </div>
        ) : (
          <p>No errors detected in this log file.</p>
        )}
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h3>Summary</h3>
        <p>Total Errors: {analysis.errorFrequency}</p>
        <p>Most Frequent Time Range: {analysis.mostFrequentTimeRange}</p>
      </div>

      {/* Actions */}
      <div className="actions">
        <button className="mt-6" onClick={exportCSV}>
          Export CSV
        </button>
        <button className="mt-6" onClick={downloadFullReport}>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default LogResults;
