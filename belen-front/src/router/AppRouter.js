import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Welcome from '../pages/Welcome';
import Carro1 from '../pages/Shop/Carro1';
import Carro2 from '../pages/Shop/Carro2';
import Carro3 from '../pages/Shop/Carro3';
import Carro4 from '../pages/Shop/Carro4';
import Streaming from '../pages/Streaming/Streaming';
import WaitingRoom from '../pages/WaitingRoom/WaitingRoom';
import Confirm from '../pages/Confirm';
import LoginScreen from '../pages/Auth/Login/Login';
import Login2Screen from '../pages/Auth/Login/Login2';
import ConfirmDonation from '../pages/Confirm/Donation';
import ErrorTrx from '../pages/Error';
import LoginDashboard from '../pages/AdminDashboard/Auth';
import Dashboard from '../pages/AdminDashboard/Dashboard';

export const AppRouter = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/confirmacion" component={ Confirm } />
                    <Route exact path="/confirmacion-donacion" component={ ConfirmDonation } />
                    <Route exact path="/error-trx" component={ ErrorTrx } />
                    <Route exact path="/ingresa-tus-datos" component={ Carro1 } />
                    <Route exact path="/experiencia-gastronomica" component={ Carro2 } />
                    <Route exact path="/invitados" component={ Carro3 } />
                    <Route exact path="/iniciarsesion" component={ LoginScreen } />
                    <Route exact path="/iniciarsesion2" component={ Login2Screen } />
                    <Route exact path="/medio-de-pago" component={ Carro4 } />
                    <Route exact path="/streaming" component={ Streaming } />
                    <Route exact path="/salaespera" component={ Streaming } />
                    <Route exact path="/dashboard" component={ LoginDashboard } />
                    <Route path="/dashboard/admin" component={ Dashboard } />
                    <Route path="/" component={ Welcome } />
                    <Route path="/login" component={ LoginScreen } />
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    )
}