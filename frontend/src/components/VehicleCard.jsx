export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800">
          {vehicle.make} {vehicle.model}
        </h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
          {vehicle.category}
        </span>
      </div>

      <p className="text-2xl font-semibold text-slate-900 mb-1">
        ${vehicle.price.toLocaleString()}
      </p>

      <p className={`text-sm mb-4 ${outOfStock ? "text-red-600" : "text-slate-500"}`}>
        {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock}
          className="flex-1 bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Purchase
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(vehicle)}
              className="px-3 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              onClick={() => onRestock(vehicle.id)}
              className="px-3 py-2 border border-green-300 text-green-700 rounded text-sm hover:bg-green-50"
            >
              Restock
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="px-3 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}