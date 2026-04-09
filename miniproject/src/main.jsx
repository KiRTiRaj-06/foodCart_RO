import  React  from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements , Route , RouterProvider } from 'react-router-dom'
import MenuItems from './components/MenuItems.jsx'
import './index.css'
import App from './App.jsx'
import Cart from './components/Cart.jsx'
import Order from './components/Order.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Home from './components/Home.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import MenuUploadForm from './components/admin/menu_upload_form.jsx'
import { MenuProvider} from "./context/MenuContext.jsx"
import { CartProvider } from './context/CartContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import Profile from './components/Profile.jsx'

const router = createBrowserRouter( createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route path='' element={<Home />}/>
      <Route path='menu' element={<MenuItems />}/>
      <Route path='Cart' element={<Cart />}/>
      <Route path='Order' element={<Order />}/>
      <Route path='login' element={<Login/>} />
      <Route path='signup' element={<Signup/>}/>
      <Route path='profile' element={<Profile/>}/>
      //Admin 
      <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="uploads" element={<MenuUploadForm />} />
      </Route>
    </Route>
))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <MenuProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </MenuProvider>
    </UserProvider>
  </React.StrictMode>,
)