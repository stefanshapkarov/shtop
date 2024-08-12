import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MainLayout} from "./components/main-layout/MainLayout";
import {HomePage} from "./pages/home-page/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {I18nextProvider} from "react-i18next";
import i18 from "./i18";
import {SearchRoute} from "./pages/search-route-page/SearchRoute";
import {RoutePage} from "./pages/route-page/RoutePage";

const App: React.FC = () => {
    return (
        <I18nextProvider i18n={i18}>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="search-route" element={<SearchRoute/>}/>
                        <Route path="route/:id" element={<RoutePage/>}/>
                        {/*
                            Note: All other routes need to be children of MainLayout route so the header and footer render accordingly

                            example:
                            <Route path="list" element={<ListPage />} />
                            */}
                            <Route path="/login" element={<LoginPage />}> </Route>
                            <Route path="/register" element={<RegisterPage />}> </Route>
                        </Route>
                        
                </Routes>
            </Router>
        </I18nextProvider>
    );
};

export default App;
