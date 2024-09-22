import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    {
      value: "highest_lowercase_alphabet",
      label: "Highest lowercase alphabet",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    setSelectedOptions([]);
    try {
      const parsedInput = JSON.parse(input);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid input format");
      }
      const res = await axios.post("http://localhost:3000/bfhl", parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;
    const selectedFields = selectedOptions.map((option) => option.value);
    const filteredResponse = {};
    selectedFields.forEach((field) => {
      if (response[field]) {
        filteredResponse[field] = response[field];
      }
    });
    return (
      <div>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        <p>User ID: {response.user_id}</p>
        <p>Email: {response.email}</p>
        <p>Roll Number: {response.roll_number}</p>
        {response.file_valid && (
          <>
            <p>File Valid: {response.file_valid.toString()}</p>
            <p>File MIME Type: {response.file_mime_type}</p>
            <p>File Size: {response.file_size_kb} KB</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL React App</h1>
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON input (e.g., {"data": ["A","1","B","2"], "file_b64": "base64string"})'
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-section">
          <h2>Filtered Response</h2>
          <div className="dropdown-container">
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
              placeholder="Select fields to display"
              className="multi-select"
            />
          </div>
          <div className="filtered-response">
            {selectedOptions.length > 0 ? (
              renderFilteredResponse()
            ) : (
              <p>Please select options to display the response</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
