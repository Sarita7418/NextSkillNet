"use client"

import React from 'react'
import Footer from '../components/organism/Footer'
import Header from '../components/organism/Header'
import UsuarioMenu from '../components/UsuarioMenu'

function page() {
  return (
    <div>
        <Header/>
        <UsuarioMenu/>
        <Footer/>
    </div>
  )
}

export default page