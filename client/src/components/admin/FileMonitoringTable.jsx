import { useEffect, useState } from "react";
import { getAllLogs } from "../../../../client/src/api/file.api";
import LogDetailModal from "./LogDetailsModal";
import ErrorChart from "./ErrorCharts";

const PAGE_SIZE = 5;

const FileMonitoring = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [fileSearch, setFileSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchLogs = async () => {
    try {
      const res = await getAllLogs({
        page,
        limit: PAGE_SIZE,
        user: userSearch,
        file: fileSearch,
      });

      setLogs(res.data.logs || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error("Failed to fetch logs", error);
      setLogs([]);
    }
  };

  // fetch when page OR search changes
  useEffect(() => {
    fetchLogs();
  }, [page, userSearch, fileSearch]);

  // reset page when searching
  useEffect(() => {
    setPage(1);
  }, [userSearch, fileSearch]);

  const handlePrev = () => {
    if (pagination?.previousPage) {
      setPage(pagination.previousPage);
    }
  };

  const handleNext = () => {
    if (pagination?.nextPage) {
      setPage(pagination.nextPage);
    }
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">File Monitoring</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by user"
          className="border p-2 rounded"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by file name"
          className="border p-2 rounded"
          value={fileSearch}
          onChange={(e) => setFileSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
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
            {logs.map((log) => (
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

            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination mt-4 flex items-center justify-center gap-4">
        <button
          disabled={!pagination?.previousPage}
          onClick={handlePrev}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={!pagination?.nextPage}
          onClick={handleNext}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {logs.map((log) => (
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

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {selectedLog && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Error Distribution</h3>
          <ErrorChart data={selectedLog.analysis?.topErrors} />
        </div>
      )}
    </div>
  );
};

export default FileMonitoring;