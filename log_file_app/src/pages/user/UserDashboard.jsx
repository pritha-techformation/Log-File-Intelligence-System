import { useEffect, useState } from "react";
import { getMyLogs } from "../../api/file.api";
import { Bar, Pie } from "react-chartjs-2";
import "../../components/styles/UserDashboard.css";

const UserDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getMyLogs();
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  // ----- Stats -----
  const totalLogs = logs.length;

  const totalErrors = logs.reduce(
    (sum, log) => sum + (log.analysis?.errorFrequency || 0),
    0
  );

  const lastUpload = logs[0]?.createdAt
    ? new Date(logs[0].createdAt).toLocaleDateString()
    : "No uploads";

  // ----- Error aggregation -----
  const errorMap = {};

  logs.forEach((log) => {
    log.analysis?.topErrors?.forEach((err) => {
      errorMap[err.type] = (errorMap[err.type] || 0) + err.count;
    });
  });

  const errorChart = {
    labels: Object.keys(errorMap),
    datasets: [
      {
        label: "Errors",
        data: Object.values(errorMap),
      },
    ],
  };

  // ----- Time aggregation -----
  const timeMap = {};

  logs.forEach((log) => {
    log.analysis?.timeRanges?.forEach((t) => {
      timeMap[t.range] = (timeMap[t.range] || 0) + t.count;
    });
  });

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

      <h1>User Dashboard</h1>

      {/* Stats */}
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

      {/* Charts */}
      <div className="charts-grid">

        <div className="chart-card">
          <h3>Error Types</h3>
          <Bar data={errorChart} />
        </div>

        <div className="chart-card">
          <h3>Error Time Distribution</h3>
          <Pie data={timeChart} />
        </div>

      </div>

      {/* Recent Logs */}
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
                <td>{log.fileName}</td>
                <td>{log.status}</td>
                <td>{log.analysis?.errorFrequency || 0}</td>
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