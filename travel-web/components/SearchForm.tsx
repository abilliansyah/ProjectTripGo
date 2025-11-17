'use client';

import React from 'react';

// Icon SVG sederhana untuk elemen form
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const DateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchInput = ({ icon, label, placeholder }: { icon: React.ReactNode, label: string, placeholder: string }) => (
  <div className="flex-1 min-w-[150px] p-2 bg-white rounded-xl shadow-inner border border-gray-100">
    <label className="text-xs font-semibold text-gray-500 block">{label}</label>
    <div className="flex items-center mt-1">
      {icon}
      <select className="ml-2 w-full text-gray-800 font-medium border-none focus:ring-0">
        <option>{placeholder}</option>
        <option>Cilegon</option>
        <option>Serang</option>
        <option>Rangkasbitung</option>
      </select>
    </div>
  </div>
);

export default function SearchForm() {
  return (
    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-2xl shadow-xl w-full max-w-5xl">
      <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
        
        <SearchInput icon={<LocationIcon />} label="Lokasi Awal" placeholder="PILIH" />
        <SearchInput icon={<LocationIcon />} label="Lokasi Tujuan" placeholder="PILIH" />
        <SearchInput icon={<DateIcon />} label="Keberangkatan" placeholder="PILIH" />
        <SearchInput icon={<UserIcon />} label="Penumpang" placeholder="PILIH" />

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition duration-200 min-w-[100px] w-full lg:w-auto shadow-lg shadow-orange-200">
          Cari
        </button>
      </div>
    </div>
  );
}