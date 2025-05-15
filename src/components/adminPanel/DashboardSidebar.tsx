// import { useState } from "react";
import { Link } from "react-router-dom";

export const DashboardSidebar = () => {

    // const [isSelected, setIsSelected] = useState();

    return (
        <section className="bg-[#E4E2D6] w-[300px] h-full flex flex-col">
            <img src="/akatsuki.svg" alt="logo" className="w-full h-14 mb-8" />
            <div className="gap-4 flex text-[#7B7265] items-center flex-col py-4 w-full h-full">
                <Link to={"/admin/dashboard"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">Dashboard</p></Link>
                <Link to={"/admin/products"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">Products</p></Link>
                <Link to={"/admin/coupons"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">Coupons</p></Link>
                <Link to={"/admin/orders"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">Orders</p></Link>
                <Link to={"/admin/vouchers"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">Vouchers</p></Link>
                <Link to={"/admin/blogs"} className="flex flex-col items-center w-[95%] justify-self-center rounded-lg"><p className="py-2 rounded-lg text-xl pl-4  w-full h-full items-center">blogs</p></Link>
            </div>
        </section>
    );
};