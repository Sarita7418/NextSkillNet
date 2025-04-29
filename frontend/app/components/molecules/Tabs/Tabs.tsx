"use client"; 
import React from 'react';
import './Tabs.css';

const Tabs: React.FC = () => {
  const tabs = ['Todo', 'Mis Publicaciones', 'Empleos'];
  const [active, setActive] = React.useState(0);

  return (
    <nav className="tabs">
      {tabs.map((label, i) => (
        <button
          key={label}
          className={i === active ? 'tab active' : 'tab'}
          onClick={() => setActive(i)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};
export default Tabs;
