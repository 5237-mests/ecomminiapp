import React from 'react'
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import Footer from "../(DashboardLayout)/layout/footer/page";

const layout = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <Footer />
    </div>
  )
}

export default layout
