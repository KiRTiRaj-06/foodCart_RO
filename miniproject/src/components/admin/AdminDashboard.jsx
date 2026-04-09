import React from "react";
import { Outlet } from "react-router";
import {apiOrderHistory} from '../../api/api'

export default function  AdminDashboard() {

    return(
        <div>
            
            <Outlet/>
        </div>
    )
}