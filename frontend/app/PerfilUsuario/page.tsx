"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '../components/organism/Footer';
import Header from '../components/organism/Header';
import UsuarioMenu from '../components/UsuarioMenu';

export default function Page() {
  // useSearchParams puede devolver null, así que hacemos un chequeo seguro
  const searchParams = useSearchParams();
  const idUsuario = searchParams ? searchParams.get('id') ?? '' : '';

  return (
    <div>
      <Header />
      {/* Pasamos idUsuario como prop a UsuarioMenu */}
      <UsuarioMenu userId={idUsuario} />
      <Footer />
    </div>
  );
}
