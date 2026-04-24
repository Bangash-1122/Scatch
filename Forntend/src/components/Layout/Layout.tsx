import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ececec]">
      <Header />
      <div className="flex flex-1 flex-col pt-[84px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
