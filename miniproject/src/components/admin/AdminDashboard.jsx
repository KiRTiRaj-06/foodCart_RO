import React from "react";
import { Outlet } from "react-router";


export default function  AdminDashboard() {

    return(
        <div>
            admin
            <Outlet/>
        </div>
    )
}