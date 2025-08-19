import { Outlet } from "react-router-dom";
//import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardMain = () => {
    return (
        <div className='h-screen flex w-full'>
            {/* <ReactLenis root> */}
            {/*<DashboardSidebar />*/}
            <Outlet />
            {/* <Footer /> */}
            {/* </ReactLenis> */}
        </div>
    );
};