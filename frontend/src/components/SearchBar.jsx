import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [make, setMake] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const params = {};
    if (make) params.make = make;
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    onSearch(params);
  }

  function handleClear() {
    setMake(""); setCategory(""); setMinPrice(""); setMaxPrice("");
    onSearch({});
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-slate-500 mb-1">Make</label>
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-32"
          placeholder="Toyota"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-32"
          placeholder="Sedan"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Min Price</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-28"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Max Price</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-28"
        />
      </div>
      <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700">
        Search
      </button>
      <button type="button" onClick={handleClear} className="text-sm text-slate-500 px-2">
        Clear
      </button>
    </form>
  );
}