import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
// import BrowserUnsupported from "./components/VideoChatApp/BrowserUnsupported/BrowserUnsupported";
// import DailyIframe from "@daily-co/daily-js";
import './index.css';
import App from './App';
import './rApp.css';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

serviceWorker.unregister();
