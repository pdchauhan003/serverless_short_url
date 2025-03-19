import React, { useState } from "react";
import axios from "axios";
import { ClipboardCopy } from "lucide-react"; // Import copy icon
import IMG1 from "../assets/bg.png";

const UrlSort = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // State for copied confirmation

  const validateUrl = (inputUrl) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlPattern.test(inputUrl);
  };

  const formatUrl = (inputUrl) => {
    return inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`;
  };

  const handleSubmit = async () => {
    if (!validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const formattedUrl = formatUrl(url);
      const response = await axios.post(
        "https://252djmnhui.execute-api.ap-south-1.amazonaws.com/dev/shorten",
        { long_url: formattedUrl },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setShortUrl(response.data.short_url);
    } catch (error) {
      console.log(error);
      setError("Failed to shorten URL. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white p-6 relative"
      style={{
        backgroundImage: `url(${IMG1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-80"></div>
      <div className="relative z-10 text-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-500 drop-shadow-lg">
          URL Shortener
        </h1>
        <p className="text-gray-300 mb-6 text-lg">
          Enter a long URL to get a shorter version that you can easily share.
        </p>
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full border border-blue-500">
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              "Shorten URL"
            )}
          </button>
          {shortUrl && (
            <div className="mt-4 p-3 bg-gray-700 text-center rounded-lg border border-gray-600 flex justify-between items-center shadow-lg">
              <span className="text-blue-400 font-semibold mr-2">
                Short URL:
              </span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline break-all flex-1 text-left"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="ml-2 text-blue-400 hover:text-blue-300 transition p-2 rounded-md bg-gray-800 hover:bg-gray-600"
              >
                <ClipboardCopy size={20} />
              </button>
            </div>
          )}
          {copied && (
            <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlSort;
