// app/Inicio/page.tsx
import React from 'react';
import Header from '../components/organism/Header';
import Footer from '../components/organism/Footer';
import Messages from '../components/organism/Messages/Messages';
import Tabs from '../components/molecules/Tabs/Tabs';
import NotificationsList from '../components/molecules/NotificationList/NotificationsList';
import CarouselCards from '../components/molecules/CarouselCards/CarouselCards';
import './page.css'; // tus overrides de layout




export default function InicioPage() {
  return (
    <>
      <Header />

      <div className="main-layout">
        <Messages />

        <section className="right-section">
          <Tabs />
          <NotificationsList />   {/* o cambia por otra lista si es diferente */}
          <CarouselCards />
        </section>
      </div>

      <Footer />
    </>
  );
}