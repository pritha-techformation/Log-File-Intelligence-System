import { useEffect, useState } from "react";
import { getAllLogs } from "../../api/file.api";
import LogDetailModal from "./LogDetailsModal";
import ErrorChart from "./ErrorCharts";

const FileMonitoring = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    const res = await getAllLogs();
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (filteredLogs.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>No logs found.</p>
      </div>
    );
  } else if (logs.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>Loading logs...</p>
      </div>
    );
  } else {
    return (
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">File Monitoring</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by user..."
          className="border p-2 mb-4 w-full md:w-64 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">File</th>
                <th className="p-3">Status</th>
                <th className="p-3">Errors</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id} className="border-t text-center">
                  <td className="p-3">{log.user?.name}</td>
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
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p>
                <span className="font-semibold">User:</span> {log.user?.name}
              </p>
              <p>
                <span className="font-semibold">File:</span> {log.fileName}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {log.status}
              </p>
              <p>
                <span className="font-semibold">Errors:</span>{" "}
                {log.analysis?.errorFrequency}
              </p>

              <button
                onClick={() => setSelectedLog(log)}
                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedLog && (
          <LogDetailModal
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}

        {/* ERROR CHART */}
        {selectedLog && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Error Distribution</h3>

            <ErrorChart data={selectedLog.analysis?.topErrors} />
          </div>
        )}
      </div>
    );
  }
};

export default FileMonitoring;
