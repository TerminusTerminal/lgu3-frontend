import axios from 'axios';

const GEMINI_API_URL = 'https://gemini.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

export const summarizeReport = async (reportText) => {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: reportText },
      { headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return response.data.text;
  } catch (error) {
    console.error('Error summarizing report:', error);
    return 'Failed to generate summary.';
  }
};