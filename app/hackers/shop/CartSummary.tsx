'use client';

import React from 'react';

interface HardwareItem {
  id: number;
  name: string;
  cost: number;
  stock: number;
}

interface Budget {
  maxBudget: number;
  totalSpent: number;
  remaining: number;
}

interface CartItem {
  item: HardwareItem;
  quantity: number;
}

interface Props {
  cart: CartItem[];
  budget: Budget | null;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  handleCheckout: () => void;
}

export default function CartSummary({
  cart,
  budget,
  removeFromCart,
  updateQuantity,
  handleCheckout
}: Props) {
  const totalCost = cart.reduce((sum, ci) => sum + ci.item.cost * ci.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <div className="mt-12 bg-white/10 border border-white/20 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Shopping Cart</h2>

      <div className="space-y-4">
        {cart.map(ci => (
          <div key={ci.item.id} className="flex justify-between items-center border-b border-white/20 pb-2">
            <div>
              <p className="text-white font-semibold">{ci.item.name}</p>
              <p className="text-white/60 text-sm">${ci.item.cost} ×</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={ci.item.stock}
                value={ci.quantity}
                onChange={(e) =>
                  updateQuantity(ci.item.id, Math.min(Math.max(1, parseInt(e.target.value) || 1), ci.item.stock))
                }
                className="w-16 p-1 text-center bg-white/10 border border-white/30 text-white rounded"
              />
              <p className="text-white/80">${ci.item.cost * ci.quantity}</p>
              <button
                onClick={() => removeFromCart(ci.item.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-white text-lg font-semibold">
          Total: ${totalCost}
        </p>
        <button
            onClick={handleCheckout}
            disabled={budget ? totalCost > budget.remaining : false}
            className="bg-white text-[#01206a] px-4 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-400/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
            Purchase All
        </button>
      </div>
    </div>
  );
}
