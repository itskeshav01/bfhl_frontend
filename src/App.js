import React, { useState, useEffect } from "react";

function App() {
  const [inputJson, setInputJson] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Set website title
  useEffect(() => {
    document.title = "0827IO211033"; // Set the title in the browser tab
  }, []);

  // Sanitize and validate JSON input
  const sanitizeJSON = (input) => {
    return input.replace(/“|”/g, '"'); // Replace curly quotes with standard double quotes
  };

  const validateJSON = (input) => {
    try {
      JSON.parse(input); // Check if input is valid JSON
      return true;
    } catch (err) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedInput = sanitizeJSON(inputJson);

    if (!validateJSON(sanitizedInput)) {
      setError("Invalid JSON input");
      return;
    }

    try {
      const response = await fetch("https://bfhl-backend-z8dc.onrender.com/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sanitizedInput,
      });

      const data = await response.json();
      setResponseData(data);
      setError("");
    } catch (err) {
      setError("Something went wrong while connecting to the server.");
    }
  };

  // Handle dropdown filter selection
  const handleFilterChange = (e) => {
    const { value } = e.target;

    if (!selectedFilters.includes(value)) {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  // Remove a filter when cross button is clicked
  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== filter));
  };

  // Render filtered response based on selected filters
  const renderFilteredResponse = () => {
    if (!responseData) return null;

    let filteredData = {};
    if (selectedFilters.includes("Alphabets")) filteredData.alphabets = responseData.alphabets.join(", ");
    if (selectedFilters.includes("Numbers")) filteredData.numbers = responseData.numbers.join(", ");
    if (selectedFilters.includes("Highest Lowercase Alphabet"))
      filteredData.highest_lowercase_alphabet =
        responseData.highest_lowercase_alphabet.join(", ");

    return (
      <div className="mt-6 bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Filtered Response:</h3>
        {filteredData.numbers && <p><strong>Numbers:</strong> {filteredData.numbers}</p>}
        {filteredData.alphabets && <p><strong>Alphabets:</strong> {filteredData.alphabets}</p>}
        {filteredData.highest_lowercase_alphabet && (
          <p><strong>Highest Lowercase Alphabet:</strong> {filteredData.highest_lowercase_alphabet}</p>
        )}
      </div>
    );
  };

  // Render file information if available
  const renderFileInfo = () => {
    if (!responseData || !responseData.file_valid) return null;

    return (
      <div className="mt-6 bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">File Information:</h3>
        <p><strong>MIME Type:</strong> {responseData.file_mime_type}</p>
        <p><strong>File Size:</strong> {responseData.file_size_kb} KB</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-green-300"
          rows="5"
          placeholder='Enter JSON input (e.g., {"data": ["A", "C", "z"]})'
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
          Submit
        </button>
      </form>

      {/* Filters */}
      {responseData && (
        <div className="mt-6 w-full max-w-lg bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Filters:</h3>
          <select onChange={handleFilterChange} className="w-full mt-2 border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring focus:ring-green-300">
            <option value="" disabled selected>Select a filter...</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          {/* Selected filters displayed as tiles */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-2 mt-4">
              {selectedFilters.map((filter) => (
                <div key={filter} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-md">
                  <span>{filter}</span>
                  {/* Cross button */}
                  <button onClick={() => removeFilter(filter)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Render Filtered Response */}
      {renderFilteredResponse()}

      {/* Render File Information */}
      {renderFileInfo()}
    </div>
  );
}

export default App;