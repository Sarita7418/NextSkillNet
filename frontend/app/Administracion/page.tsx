import React from 'react'
import Header from '../components/organism/Header'
import Footer from '../components/organism/Footer'
import AdminMenu from '../components/AdminMenu'

function page() {
  return (
    <div>
        <Header/>
        <AdminMenu/>
        <Footer/>
    </div>
  )
}

export default page