"use client";

import { useState, useEffect, useMemo } from "react";
import { type Fish } from "./lib/fish";
import {
  loadFishData,
  getFishByName,
  getFishBySpot,
  getFishByLure,
} from "./lib/fishUtils";

export default function FishingPage() {
  const [fishData, setFishData] = useState<Fish[]>([]);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Fish[]>([]);
  const [mode, setMode] = useState<"name" | "spot" | "lure">("name");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [spotMode, setSpotMode] = useState<"include-any" | "specific-only">(
    "include-any"
  );

  useEffect(() => {
    loadFishData().then(setFishData);
  }, []);

  const handleSearch = () => {
    if (!fishData.length) return;

    if (mode === "name") {
      setResults(getFishByName(fishData, query));
    }

    if (mode === "lure") {
      setResults(getFishByLure(fishData, query));
    }

    if (mode === "spot") {
      const spot = Number(query);
      if (!spot) {
        setResults([]);
        return;
      }

      if (spotMode === "include-any") {
        setResults(
          fishData.filter(
            (f) =>
              f.spots === "any" ||
              (Array.isArray(f.spots) && f.spots.includes(spot))
          )
        );
      } else {
        // specific-only mode
        setResults(
          fishData.filter(
            (f) => Array.isArray(f.spots) && f.spots.includes(spot)
          )
        );
      }
    }
  };

  useEffect(() => {
    if (!fishData.length) return;

    const q = query.trim();
    if (q === "") {
      setResults([]);
      return;
    }

    if (mode === "name") {
      setResults(getFishByName(fishData, q));
      return;
    }

    if (mode === "lure") {
      setResults(getFishByLure(fishData, q));
      return;
    }

    // spot mode
    const spot = Number(q);
    if (!spot) {
      setResults([]);
      return;
    }

    if (spotMode === "include-any") {
      setResults(
        fishData.filter(
          (f) =>
            f.spots === "any" ||
            (Array.isArray(f.spots) && f.spots.includes(spot))
        )
      );
    } else {
      setResults(
        fishData.filter((f) => Array.isArray(f.spots) && f.spots.includes(spot))
      );
    }
  }, [query, mode, spotMode, fishData]);

  const handleModeChange = (newMode: "name" | "spot" | "lure") => {
    setMode(newMode);
    setResults([]);
    setQuery("");
  };

  const handleTableView = () => {
    setShowTable(!showTable);
    setShowInfo(false);
    setShowMap(false);
    setResults(fishData);
    setQuery("");
  };

  return (
    <div className="flex">
      <div className="flex items-baseline justify-center">
        {showInfo && <img src="/lures.png" alt="Fish Lures" />}
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Hay Day Fishing Finder 🎣
        </h1>

        <div className="flex gap-3 mb-4 justify-center">
          {!showTable &&
            ["name", "spot", "lure"].map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m as "name" | "spot" | "lure")}
                className={`px-4 py-2 rounded-md ${
                  mode === m
                    ? "bg-blue-400 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {m}
              </button>
            ))}

          {!showInfo && !showTable && (
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 rounded-md ${
                showMap
                  ? "bg-yellow-300 text-gray-500"
                  : "bg-gray-100 text-black"
              }`}
            >
              Show Map
            </button>
          )}

          {!showMap && !showTable && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-4 py-2 rounded-md ${
                showInfo
                  ? "bg-yellow-300 text-gray-500"
                  : "bg-gray-100 text-black"
              }`}
            >
              Show Info
            </button>
          )}

          <button
            onClick={() => handleTableView()}
            className={`px-4 py-2 rounded-md ${
              showTable
                ? "bg-green-300 text-gray-500"
                : "bg-gray-100 text-black"
            }`}
          >
            Table
          </button>
        </div>
        <div>
          {mode === "spot" && (
            <select
              value={spotMode}
              onChange={(e) =>
                setSpotMode(e.target.value as "include-any" | "specific-only")
              }
              className="w-full p-2 border rounded-md mb-3"
            >
              <option value="include-any">Include all spots</option>
              <option value="specific-only">
                Search only by specific spot
              </option>
            </select>
          )}
        </div>

        {(showMap || showInfo) && !showTable && (
          <div className="mb-4">
            <img
              src="/FishingMap_Names.png"
              alt="Hay Day Fishing Map"
              className="w-full rounded-md border"
            />
          </div>
        )}
        {showTable && (
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Lure</th>
                  <th className="border p-2">Spots</th>
                  <th className="border p-2">Circle</th>
                  <th className="border p-2">Event Only</th>
                </tr>
              </thead>
              <tbody>
                {results.map((fish) => (
                  <tr key={fish.id} className="text-center">
                    <td className="border p-2">{fish.name}</td>
                    <td className="border p-2">{fish.lure.join(" / ")}</td>
                    <td className="border p-2">
                      {fish.spots === "any"
                        ? "Any spot"
                        : fish.spots.join(", ")}
                    </td>
                    <td className="border p-2">{fish.circle}</td>
                    <td className="border p-2">
                      {fish.eventOnly ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!showTable && (
          <div>
            <input
              type="text"
              placeholder={`Search by ${mode}...`}
              className="w-full p-3 border rounded-md mb-3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-md"
            >
              Search
            </button>

            <div className="mt-6 space-y-4">
              {results.map((fish) => (
                <div
                  key={fish.id}
                  className={`p-4 border rounded-md shadow-sm bg-[${
                    fish.lure[0] ?? "cyan"
                  }]-100`}
                >
                  <h2 className="font-bold text-lg">{fish.name}</h2>
                  <p>
                    <span className="font-semibold">Lure:</span>{" "}
                    {fish.lure.join(" / ")}
                  </p>
                  <p>
                    <span className="font-semibold">Spot:</span>{" "}
                    {fish.spots === "any" ? "Any spot" : fish.spots.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">Circle:</span> {fish.circle}
                  </p>
                  {fish.eventOnly && (
                    <p className="text-red-600 font-bold">Event Only</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-baseline">
        {showInfo && <img src="/rarity.jpg" alt="Fish Rarity" />}
      </div>
    </div>
  );
}
