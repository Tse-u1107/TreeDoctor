import React, { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
};

export const useTab = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTab must be used within a TabProvider');
    }
    return context;
};