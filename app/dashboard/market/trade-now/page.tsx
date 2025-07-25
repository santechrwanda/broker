"use client";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";

export default function TradePage() {
  const { symbol } = { symbol: "MTNR"};
  const [shares, setShares] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="p-5 pt-0">
      <h1 className="text-2xl text-[#004f64] font-bold mb-4">Trade {symbol}</h1>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company & Security Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl text-gray-700 font-semibold mb-2">Company/Organization Info</h2>
            <p><strong className="text-gray-500">Name:</strong> Example Corp</p>
            <p><strong className="text-gray-500">Email:</strong> contact@example.com</p>
            <p><strong className="text-gray-500">Sector:</strong> Finance</p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl text-gray-700 font-semibold mb-2">Security Info</h2>
            <p><strong className="text-gray-500">Symbol:</strong> {symbol}</p>
            <p><strong className="text-gray-500">Price per Share:</strong> $120</p>
            <p><strong className="text-gray-500">Available Shares:</strong> 100,000</p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Buy Shares</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-500/40 rounded focus:outline-none"
                placeholder="Shares"
              />
              <button className="px-4 py-2 cursor-pointer bg-[#20acd3] text-white rounded hover:bg-[#5693a4]">
                Request Now
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Total: ${shares * 120}
            </p>
          </div>
        </div>

        {/* Right Column: Chat Box */}
        <div className="bg-white p-5 pr-0 rounded shadow flex flex-col h-[500px]">
          <h2 className="text-xl text-gray-700 font-semibold mb-3">Live Chat</h2>
          <div className="flex-1 overflow-y-auto mb-4 rounded p-2 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-400">No messages yet</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <FaRegUserCircle className="text-gray-500 mt-1" />
                  <div className="bg-gray-100 px-3 py-2 rounded">{msg}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 pr-5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 border border-gray-500/40 rounded focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-[#20acd3] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#5693a4]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
