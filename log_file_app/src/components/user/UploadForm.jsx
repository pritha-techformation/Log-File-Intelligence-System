// components/logs/UploadLogForm.jsx

import { useState } from "react";
import { uploadLog } from "../../api/file.api";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "../styles/UploadForm.css";
import { useNavigate } from "react-router-dom";

const UploadLogForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [logId, setLogId] = useState(null);

  const handleFile = (selectedFile) => {
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result.slice(0, 500));
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

const handleUpload = async () => {
  if (!file) {
    toast.error("Select a log file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await uploadLog(formData, {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    });

    toast.success("Log uploaded successfully");

    const logId = res.data.log._id;

    setAnalysis(res.data.analysis);
    setLogId(logId);

    // redirect to results page
    setTimeout(() => {
        navigate(`/logs/${logId}`);
    }, 2000);
    

  } catch (err) {
    toast.error("Upload failed");
    console.error(err);
  }
};

  const shareReport = () => {
    const url = `${window.location.origin}/logs/${logId}`;

    if (navigator.share) {
      navigator.share({
        title: "Log Analysis Report",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="upload-page">

      <h2>Upload Log File</h2>

      {/* Drag Drop Area */}
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? file.name : "Drag & Drop log file here"}
      </div>

      <input
        type="file"
        accept=".txt"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload</button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* File Preview */}
      {preview && (
        <div className="preview">
          <h4>File Preview</h4>
          <pre>{preview}</pre>
        </div>
      )}

      {/* Error Chart */}
      {analysis && (
        <div className="charts">
          <h3>Error Frequency</h3>

          <Bar
            data={{
              labels: analysis.errorTypes.map((e) => e.type),
              datasets: [
                {
                  label: "Errors",
                  data: analysis.errorTypes.map((e) => e.count),
                },
              ],
            }}
          />
        </div>
      )}

      {/* Actions */}
      {logId && (
        <div className="actions">

          <a
            href={`/api/logs/report/${logId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Download PDF</button>
          </a>

          <button onClick={shareReport}>
            Share Report
          </button>

        </div>
      )}

    </div>
  );
};

export default UploadLogForm;