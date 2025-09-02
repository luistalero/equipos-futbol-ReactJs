import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
import ChatwootComponent from './ChatwootComponent.jsx';
import ChatComponent from './ChatComponent.jsx';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, userId } = useContext(AuthContext);

    return isAuthenticated ? (
        <>
            <ChatComponent userId={userId} />
            <ChatwootComponent />
            {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
