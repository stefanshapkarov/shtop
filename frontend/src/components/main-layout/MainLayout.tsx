import {Header} from "../header/Header";
import {Outlet} from "react-router-dom";
import {Footer} from "../footer/Footer";
import './main-layout.scss'

export const MainLayout = () => {
    return <>
        <div id='parent-wrapper'>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    </>
}