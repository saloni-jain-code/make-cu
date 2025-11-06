'use client';

import React, { useState } from 'react';

interface HardwareItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  stock: number;
  category: string;
  compatibility: string;
  image_url: string;
}

interface Props {
  item: HardwareItem;
  addToCart: (item: HardwareItem, quantity: number) => void;
}

export default function HardwareItemCard({ item, addToCart }: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 flex flex-col justify-between h-full hover:bg-white/15 transition-all">
      <div>
        <a 
          href={item.image_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-md font-bold text-white mb-2 hover:text-blue-300 transition-colors inline-block"
        >
          {item.name}
        </a>
        <p className="text-white/60 text-sm mb-4">{item.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/70 text-sm">Price:</span>
          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm font-bold">
            ${item.cost}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 text-sm">Stock:</span>
          <span className={`text-sm font-semibold ${item.stock > 10 ? 'text-green-300' : 'text-orange-300'}`}>
            {item.stock}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 text-sm">Compatibility:</span>
          <span className="text-blue-300 text-sm">{item.compatibility}</span>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-white/70 text-sm">Quantity:</label>
          <input
            type="number"
            min="1"
            max={item.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), item.stock))
            }
            className="w-20 text-sm p-2 border border-white/30 rounded bg-white/10 text-white text-center focus:outline-none focus:border-blue-400"
          />
        </div>

        <button
          onClick={() => addToCart(item, quantity)}
          disabled={item.stock === 0}
          className="w-full bg-white/20 border border-white/30 text-white py-2 rounded-lg font-semibold hover:bg-white/30 hover:border-white/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}