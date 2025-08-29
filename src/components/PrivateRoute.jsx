import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
import ChatwootComponent from './ChatwootComponent.jsx';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? (
        <>
            <ChatwootComponent />
            {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
