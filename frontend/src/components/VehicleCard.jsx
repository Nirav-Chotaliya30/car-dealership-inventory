export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const outOfStock = vehicle.quantity <= 0;
  const lowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const stripeColor = outOfStock ? "bg-stock-out" : lowStock ? "bg-stock-low" : "bg-stock-good";
  const stockLabel = outOfStock ? "Out of stock" : lowStock ? `Only ${vehicle.quantity} left` : `${vehicle.quantity} in stock`;
  const stockTextColor = outOfStock ? "text-stock-out" : lowStock ? "text-stock-low" : "text-stock-good";

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripeColor}`} />

      <div className="p-5 pl-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-display font-bold text-navy text-lg leading-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-xs font-medium bg-accent-soft text-accent px-2 py-1 rounded-md shrink-0 ml-2">
            {vehicle.category}
          </span>
        </div>

        <p className="text-2xl font-display font-bold text-navy mb-1">
          ${vehicle.price.toLocaleString()}
        </p>

        <p className={`text-sm font-medium mb-4 ${stockTextColor}`}>
          {stockLabel}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={outOfStock}
            className="flex-1 bg-navy text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Purchase
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(vehicle)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onRestock(vehicle.id)}
                className="px-3 py-2 border border-stock-good/30 text-stock-good rounded-lg text-sm font-medium hover:bg-green-50 transition"
              >
                Restock
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="px-3 py-2 border border-stock-out/30 text-stock-out rounded-lg text-sm font-medium hover:bg-red-50 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}