import {Header} from "../header/Header";
import {Outlet} from "react-router-dom";
import {Footer} from "../footer/Footer";

export const MainLayout = () => {
    return <>
        <div>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    </>
}