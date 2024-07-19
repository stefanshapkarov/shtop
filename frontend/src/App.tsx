import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MainLayout} from "./components/main-layout/MainLayout";
import {HomePage} from "./pages/home-page/HomePage";
import {I18nextProvider} from "react-i18next";
import i18 from "./i18";
import {SearchRoute} from "./pages/search-route-page/SearchRoute";

const App: React.FC = () => {
    return (
        <I18nextProvider i18n={i18}>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="search-route" element={<SearchRoute/>}/>
                        {/*
          Note: All other routes need to be children of MainLayout route so the header and footer render accordingly

          example:
          <Route path="list" element={<ListPage />} />
          */}
                    </Route>
                </Routes>
            </Router>
        </I18nextProvider>
    );
};

export default App;
