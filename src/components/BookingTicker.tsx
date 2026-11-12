'use client';
import { useEffect, useState } from 'react';

const BOOKINGS = [
  { name: 'Priya', city: 'Delhi', service: 'Birthday Decoration', min: 3 },
  { name: 'Rahul', city: 'Gurgaon', service: 'Anniversary Setup', min: 7 },
  { name: 'Sneha', city: 'Noida', service: 'Baby Shower Decor', min: 12 },
  { name: 'Amit', city: 'Bangalore', service: 'Kids Birthday Package', min: 2 },
  { name: 'Kavya', city: 'Mumbai', service: 'Bachelorette Decoration', min: 18 },
  { name: 'Arjun', city: 'Hyderabad', service: 'Room Decoration', min: 5 },
  { name: 'Meera', city: 'Chennai', service: 'Birthday Decoration', min: 9 },
  { name: 'Rohan', city: 'Pune', service: 'Anniversary Package', min: 1 },
  { name: 'Anjali', city: 'Kolkata', service: 'Baby Shower Setup', min: 22 },
  { name: 'Vikram', city: 'Delhi', service: 'Theme Decoration', min: 4 },
  { name: 'Deepa', city: 'Gurgaon', service: 'Birthday Balloon Setup', min: 14 },
  { name: 'Karan', city: 'Noida', service: 'Pinterest Edition', min: 6 },
];

export default function BookingTicker() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(c => (c + 1) % BOOKINGS.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const b = BOOKINGS[current];

  return (
    <div className="bg-white border-b border-orange-100 py-2 px-4 overflow-hidden">
      <div
        className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-sm transition-all duration-400"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-gray-500">Just booked:</span>
        <span className="font-bold text-gray-800">{b.name}</span>
        <span className="text-gray-400 hidden sm:inline">from {b.city}</span>
        <span className="text-orange-600 font-semibold">{b.service}</span>
        <span className="text-gray-400 hidden sm:inline">· {b.min} min ago</span>
      </div>
    </div>
  );
}
