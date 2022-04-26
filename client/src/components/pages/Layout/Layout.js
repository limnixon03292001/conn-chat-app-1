import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <main className='w-full h-full'>
      
        <Outlet/>
    </main>
  )
}

export default Layout