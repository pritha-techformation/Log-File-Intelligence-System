import { X } from "lucide-react";
import { Link } from "react-router-dom";

const AnalysisCard = ({ log, onClose }) => {
     const id = log?._id;
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Log Details</h2>
        
        <p><b>File:</b> {log.fileName}</p>
        <p><b>Status:</b> {log.status}</p>
        <p><b>Error Count:</b> {log.analysis?.errorFrequency}</p>
        <p><b>Peak Error Time:</b> {log.analysis?.mostFrequentTimeRange}</p>

        <div className="mt-4">
          <h3 className="font-semibold">Top Errors</h3>
          <ul className="list-disc ml-6">
            {log.analysis?.topErrors?.map((e, i) => (
              <li key={i}>
                {e.type} — {e.count}
              </li>
            ))}
          </ul>
        </div>

        <Link to={`/logs/${id}`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Full Log
        </Link>
      </div>
    </div>
  );
};

export default AnalysisCard;