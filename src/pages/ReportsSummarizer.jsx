import React, { useState } from 'react';
import { summarizeReport } from '../utils/summarizeReport';

const ReportsSummarizer = () => {
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    const summarizedText = await summarizeReport(reportText);
    setSummary(summarizedText);
  };

  return (
    <div>
      <h2>Report Summarization</h2>
      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="Paste your report here"
      />
      <button onClick={handleSummarize}>Summarize Report</button>
      <div>
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default ReportsSummarizer;
