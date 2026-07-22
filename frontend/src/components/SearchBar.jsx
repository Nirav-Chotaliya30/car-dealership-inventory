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

  const inputClass = "border border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end">
      <div className="w-32">
        <label className="block text-xs font-medium text-muted mb-1">Make</label>
        <input value={make} onChange={(e) => setMake(e.target.value)} className={inputClass} placeholder="Toyota" />
      </div>
      <div className="w-32">
        <label className="block text-xs font-medium text-muted mb-1">Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="Sedan" />
      </div>
      <div className="w-28">
        <label className="block text-xs font-medium text-muted mb-1">Min Price</label>
        <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass} />
      </div>
      <div className="w-28">
        <label className="block text-xs font-medium text-muted mb-1">Max Price</label>
        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass} />
      </div>
      <button type="submit" className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition">
        Search
      </button>
      <button type="button" onClick={handleClear} className="text-sm text-muted hover:text-navy px-2 transition">
        Clear
      </button>
    </form>
  );
}