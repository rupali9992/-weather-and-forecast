import React, { useEffect, useState, useRef } from "react";

import "./App.css";

export default function Main() {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMoreRef = useRef();

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    fetch(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchQuery}&refine.country=India`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const cities = data.records.map((record) => record.fields);
        setResults(cities);
        setTotalPages(Math.ceil(data.nhits / 100));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchResults = () => {
    setLoading(true);
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${
        (page - 1) * 100
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setResults((prevResults) => [...prevResults, ...data.results]);
        setTotalPages(Math.ceil(data.total_count / 100));
        setPage(page + 1);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleClickCity = (cityId) => {
    console.log("City ID:", cityId);
    const weatherUrl = `/checkWeather/${cityId}`;
    window.open(weatherUrl, "_blank");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <br />
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900  md:text-5xl lg:text-4xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Check Weather
          </span>{" "}
          for all countries and cities in world !
        </h1>

        <form className="flex items-center max-w-sm mx-auto">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search city name..."
              value={searchQuery}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sr.no
              </th>
              <th scope="col" className="px-6 py-3">
                City name
              </th>
              <th scope="col" className="px-6 py-3">
                Country
              </th>
              <th scope="col" className="px-6 py-3">
                timezone
              </th>
              <th scope="col" className="px-6 py-3">
                country_code
              </th>
              <th scope="col" className="px-6 py-3">
                population
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((city, index) => (
              <tr
                key={city.geoname_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td
                  value={city.geoname_id}
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  onClick={() => handleClickCity(city.geoname_id)}
                >
                  {city.name}
                </td>
                <td className="px-6 py-4">{city.cou_name_en}</td>
                <td className="px-6 py-4">{city.timezone}</td>
                <td className="px-6 py-4">{city.country_code}</td>
                <td className="px-6 py-4">{city.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        {loading && <p>Loading...</p>}
        {!loading && page < totalPages && (
          <div ref={loadMoreRef} className="text-center py-4">
            <button
              onClick={() => fetchResults()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
