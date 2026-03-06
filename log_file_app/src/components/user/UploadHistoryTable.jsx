import { getMyLogs } from "../../api/file.api";
import { useEffect, useState } from "react";
// import LogDetailModal from "../admin/LogDetailsModal";
import AnalysisCard from "./AnalysisCard";
import ErrorChart from "../admin/ErrorCharts";

const UploadHistoryTable = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    const res = await getMyLogs();
    setLogs(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">My Upload History</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by user..."
        className="border p-2 mb-4 w-64 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {/* <th className="p-3">User</th> */}
            <th className="p-3">File</th>
            <th className="p-3">Status</th>
            <th className="p-3">Errors</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log._id} className="border-t text-center">
              {/* <td className="p-3">{log.user?.name}</td> */}
              <td className="p-3">{log.fileName}</td>
              <td className="p-3">{log.status}</td>
              <td className="p-3">{log.analysis?.errorFrequency}</td>

              <td className="p-3">
                <button
                  onClick={() => setSelectedLog(log)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedLog && (
        <AnalysisCard
          log={selectedLog}
          id={selectedLog._id}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {/* ERROR CHART */}
      {selectedLog && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">
            Error Distribution
          </h3>

          <ErrorChart data={selectedLog.analysis?.topErrors} />
        </div>
      )}
    </div>
  );
};

export default UploadHistoryTable;