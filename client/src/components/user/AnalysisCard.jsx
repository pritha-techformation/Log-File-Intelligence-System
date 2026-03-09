import { X, FileText, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const AnalysisCard = ({ log, onClose }) => {
  const id = log?._id;
  if (!log) return null;

  const statusColor =
    log.status === "completed"
      ? "bg-green-100 text-green-700"
      : log.status === "processing"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <FileText className="text-blue-600" />
          <h2 className="text-xl font-bold">Log Analysis Details</h2>
        </div>

        {/* File Info */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <p>
            <b>File:</b> {log.fileName}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}
            >
              {log.status}
            </span>
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={16} />
            <span>
              <b>Error Count:</b> {log.analysis?.errorFrequency || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="text-indigo-500" size={16} />
            <span>
              <b>Peak Error Time:</b>{" "}
              {log.analysis?.mostFrequentTimeRange || "N/A"}
            </span>
          </div>
        </div>

        {/* Top Errors */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Top Errors</h3>

          <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
            {log.analysis?.topErrors?.length ? (
              <ul className="space-y-1 text-sm">
                {log.analysis.topErrors.map((e, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b pb-1 last:border-none"
                  >
                    <span className="text-gray-700">{e.type}</span>
                    <span className="font-medium text-red-600">
                      {e.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No errors detected</p>
            )}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Errors by Time</h3>

          <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
            {log.analysis?.timeRanges?.length ? (
              <ul className="space-y-1 text-sm">
                {log.analysis.timeRanges.map((t, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b pb-1 last:border-none"
                  >
                    <span>{t.range}</span>
                    <span className="font-medium">{t.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No time data</p>
            )}
          </div>
        </div>

        {/* Error Logs
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Detected Errors</h3>

          <div className="max-h-[200px] overflow-y-auto border rounded-md p-3 bg-gray-50 text-sm">
            {log.analysis?.errors?.length ? (
              log.analysis.errors.map((err, i) => (
                <div key={i} className="border-b py-1 last:border-none">
                  {err}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No errors found</p>
            )}
          </div>
        </div> */}

        {/* Button */}
        <Link
          to={`/logs/${id}`}
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          View Full Log
        </Link>
      </div>
    </div>
  );
};

export default AnalysisCard;