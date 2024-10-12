import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MainLayout} from "./components/main-layout/MainLayout";
import {HomePage} from "./pages/home-page/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {I18nextProvider} from "react-i18next";
import i18 from "./i18";
import {SearchRoute} from "./pages/search-route-page/SearchRoute";
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import {RoutePage} from "./pages/route-page/RoutePage";
import TransportCard from "./pages/transport-card-page/TransportCard";
import {YourRides} from "./pages/your-rides-page/YourRides";

const App: React.FC = () => {
    return (
        <I18nextProvider i18n={i18}>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        {/*
                            Note: All other routes need to be children of MainLayout route so the header and footer render accordingly

                            example:
                            <Route path="list" element={<ListPage />} />
                            */}
                        <Route index element={<HomePage/>}/>
                        <Route path="search-route" element={<SearchRoute/>}/>
                        <Route path="share-transport" element={<TransportCard/>}/>
                        <Route path="route/:id" element={<RoutePage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/profile-edit" element={<ProfileEditPage/>}/>
                        <Route path='/my-rides' element={<YourRides/>}/>
                    </Route>
                </Routes>
            </Router>
        </I18nextProvider>
    );
};

export default App;
