import { getMyLogs } from "../../api/file.api";
import { useEffect, useState } from "react";
import AnalysisCard from "./AnalysisCard";

// UploadHistoryTable component
const UploadHistoryTable = () => {

  // states
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  // fetch logs
  const fetchLogs = async () => {
    // Get all logs for the current user
    const res = await getMyLogs();
    setLogs(res.data);
    console.log(res.data);
  };

  // useEffect to fetch logs
  useEffect(() => {
    fetchLogs();
  }, []);

  // filter logs by file name
  const filteredLogs = logs.filter((log) =>
    log.fileName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
  <div className="p-4 md:p-6">

    <h2 className="text-xl md:text-2xl font-bold mb-4">
      My Upload History
    </h2>

    {/* SEARCH */}
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <input
        type="text"
        placeholder="Search by file name..."
        className="border p-2 rounded w-full sm:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* TABLE WRAPPER */}
    <div className="overflow-x-auto">

      <table className="min-w-[500px] w-full border rounded-lg">

        <thead className="bg-gray-100 text-sm md:text-base">
          <tr>
            <th className="p-3 text-left">File</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Errors</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log) => (
            <tr
              key={log._id}
              className="border-t text-sm md:text-base hover:bg-gray-50"
            >
              <td className="p-3 break-words">
                {log.fileName}
              </td>

              <td className="p-3">
                {log.status}
              </td>

              <td className="p-3">
                {log.analysis?.errorFrequency}
              </td>

              <td className="p-3">
                <button
                  onClick={() => setSelectedLog(log)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm md:text-base"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>

    {/* MODAL */}
    {selectedLog && (
        <AnalysisCard
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

  </div>
);
};

export default UploadHistoryTable;