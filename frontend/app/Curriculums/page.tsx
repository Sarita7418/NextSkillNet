'use client';

import React from 'react';
import Header from '../components/organism/Header';
import EnviarArchivo from '../components/organism/EnviarArchivo';
import Footer from '../components/organism/Footer';
import './page.css';

const page: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <EnviarArchivo />
      </main>
      <Footer />
    </div>
  );
};

export default page;
