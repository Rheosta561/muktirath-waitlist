import React from 'react';
import PromoCard from './PromoCard';

function PromoGrid() {
  return (
    <div className="flex justify-center py-4">
      <div className="inline-grid rounded-lg p-2.5  bg-opacity-90 shadow-sm grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4 max-w-screen-xl mx-auto">
        <PromoCard title="Produced Something?" />
        <PromoCard title="Need a Market?" />
        <PromoCard title="Certify Your Work?" />
        <PromoCard title="Looking For Beats?" />
        <PromoCard title="Connect With Us!" />
        <PromoCard title="Explore Opportunities!" />
      </div>
    </div>
  );
}

export default PromoGrid;
