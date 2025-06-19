import React from 'react';
import AppBar from '../../components/AppBar';
import ProtectedRoute from '../../components/ProtectedRoute';

const Forums = () => {

    return (
        <ProtectedRoute>
            <div className="p-8">
                <h1 className="text-3xl font-bold">My Forums Page</h1>
            </div>
        </ProtectedRoute>
    );
};

export default Forums;