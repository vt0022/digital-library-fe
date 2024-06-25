// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// // import { ErrorBoundary } from "react-error-boundary";
// import  RootRouters  from './components/routers/RootRouters';
// import { RouterProvider } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//      {/* <ErrorBoundary FallbackComponent={ErrorBoundary}> */}
//     <RouterProvider router={RootRouters} />
//     {/* </ErrorBoundary> */}
//   </React.StrictMode >
// );

import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { legacy_createStore as createStore } from "redux";

import { Provider } from "react-redux";

import rootReducer from "./redux/reducers";

// import "./assets/boxicons-2.0.7/css/boxicons.min.css";
// import "./assets/css/grid.css";
// import "./assets/css/index.css";
// import "./assets/css/theme.css";

import App from "./App";

import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import "flowbite";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Worker } from "@react-pdf-viewer/core";
import ErrorBoundary from "./ErrorBoundary";

const store = createStore(rootReducer);

document.title = "learniverse & shariverse";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId="355480575905-okvgom422abg0ecf8u9mfi4p35sp867n.apps.googleusercontent.com">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <React.StrictMode>
                    <ErrorBoundary>
                        <App />

                        <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover={false} theme="light" transition={Bounce} />
                    </ErrorBoundary>
                </React.StrictMode>
            </Worker>
        </GoogleOAuthProvider>
    </Provider>,
);

// reportWebVitals(console.log);
