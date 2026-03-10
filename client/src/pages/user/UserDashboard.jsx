import { useEffect, useState } from "react";
import { getMyLogs } from "../../api/file.api";
import { Bar, Pie } from "react-chartjs-2";
import "../../components/styles/UserDashboard.css";

const UserDashboard = () => {
  // State to store all user log files
  const [logs, setLogs] = useState([]);

  // Fetch user's uploaded logs when component loads
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getMyLogs(); // API call to get logs
        setLogs(res.data); // Store logs in state
      } catch (err) {
        console.error(err); // Log any API errors
      }
    };

    fetchLogs();
  }, []);

  // ----- Dashboard Statistics -----

  // Total number of uploaded log files
  const totalLogs = logs.length;

  // Total number of detected errors across all logs
  const totalErrors = logs.reduce(
    (sum, log) => sum + (log.analysis?.errorFrequency || 0),
    0
  );

  // Date of the most recently uploaded file
  const lastUpload = logs[0]?.createdAt
    ? new Date(logs[0].createdAt).toLocaleDateString()
    : "No uploads";

  // ----- Aggregate error types for chart -----
  const errorMap = {};

  logs.forEach((log) => {
    log.analysis?.topErrors?.forEach((err) => {
      // Count occurrences of each error type
      errorMap[err.type] = (errorMap[err.type] || 0) + err.count;
    });
  });

  // Data configuration for Error Type Bar Chart
  const errorChart = {
    labels: Object.keys(errorMap),
    datasets: [
      {
        label: "Errors",
        data: Object.values(errorMap),
        borderRadius: 6
      },
    ],
  };

  // ----- Aggregate errors by time range -----
  const timeMap = {};

  logs.forEach((log) => {
    log.analysis?.timeRanges?.forEach((t) => {
      // Count errors per time range
      timeMap[t.range] = (timeMap[t.range] || 0) + t.count;
    });
  });

  // Data configuration for Time-based error chart
  const timeChart = {
    labels: Object.keys(timeMap),
    datasets: [
      {
        label: "Errors by Time",
        data: Object.values(timeMap),
      },
    ],
  };

  return (
    <div className="dashboard">

      {/* Dashboard Title */}
      <h1 className="dashboard-title">User Dashboard</h1>

      {/* Statistics Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Logs</h3>
          <p>{totalLogs}</p>
        </div>

        <div className="stat-card">
          <h3>Total Errors</h3>
          <p>{totalErrors}</p>
        </div>

        <div className="stat-card">
          <h3>Last Upload</h3>
          <p>{lastUpload}</p>
        </div>
      </div>

      {/* Error Type Chart */}
      <div className="chart-card mb-3">
        <h3>Error Types</h3>
        <Bar data={errorChart} className="mx-auto width-full h-64" />
      </div>

      {/* Recent Uploaded Logs Table */}
      <div className="recent-logs">
        <h3>Recent Uploads</h3>

        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Errors</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {logs.slice(0, 5).map((log) => (
              <tr key={log._id}>
                {/* File name */}
                <td>{log.fileName}</td>

                {/* Processing status */}
                <td>{log.status}</td>

                {/* Total errors detected */}
                <td>{log.analysis?.errorFrequency || 0}</td>

                {/* Upload date */}
                <td>{new Date(log.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default UserDashboard;