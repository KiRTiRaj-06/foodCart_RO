import React, { useState } from 'react'
import { useUser } from '../context/UserContext'
import { apiOrderHistory } from '../api/api'
function Profile() {
    const [orders , setOrder] = useState([]);
    setOrder(apiOrderHistory)
    const {user} = useUser()
return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">

        <div className="w-full max-w-3xl space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white shadow-lg rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                My Profile
            </h2>


          {/* USER INFO */}
        <div className="space-y-4">

            <div>
                <label className="text-gray-500 text-sm">
                Username
                </label>

            <div className="border rounded-lg px-4 py-2 bg-gray-50">
                {/* {user.username} */}
            </div>
            </div>


            <div>
                <label className="text-gray-500 text-sm">
                    Email
                </label>

            <div className="border rounded-lg px-4 py-2 bg-gray-50">
                {/* {user.email} */}
                </div>
            </div>


            <div>
                <label className="text-gray-500 text-sm">
                Password
                </label>

            <div className="border rounded-lg px-4 py-2 bg-gray-50">
                {/* {user.password} */}
                </div>
            </div>

            </div>

        </div>



        {/* ORDER HISTORY */}
        <div className="bg-white shadow-lg rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order History
        </h2>


        {orders.length === 0 ? (

            <p className="text-gray-500">
                No previous orders found.
            </p>

        ) : (

            <div className="space-y-3">

            {/* {orders.map(order => (

                <div
                    key={order.id}
                    className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                >
                <span className="font-medium">
                    {order.item}
                </span>

                <span className="text-purple-600 font-semibold">
                    ₹{order.price}
                </span>

                </div>

            ))} */}

            </div>

        )}

        </div>


        </div>

    </div>
    )
}

export default Profile