import  React  from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements , Route , RouterProvider } from 'react-router-dom'
import MenuItems from './components/MenuItems.jsx'
import './index.css'
import App from './App.jsx'
import Cart from './components/Cart.jsx'
import Order from './components/Order.jsx'

const router = createBrowserRouter( createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route path='' element={<MenuItems />}/>
      <Route path='Cart' element={<Cart />}/>
      <Route path='Order' element={<Order />}/>
    </Route>
))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)