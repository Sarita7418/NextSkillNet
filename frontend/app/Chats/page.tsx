"use client";   
import React from 'react'
import Header from '../components/organism/Header'
import Footer from '../components/organism/Footer'
import ChatsLista from '../components/ChatsLista';

function pageChat() {
  return (
    <div>
        <Header/>
        <ChatsLista/>
        <Footer/>
    </div>
  )
}

export default pageChat