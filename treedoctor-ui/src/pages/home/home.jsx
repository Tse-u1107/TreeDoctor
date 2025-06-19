import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAuth } from 'firebase/auth';
import TreeList from '../myTree/TreeList';
import Badges from '../myBadges/badges';
import Calendar from '../myCalendar/calendar';
import Dashboard from './Dashboard';
import { useAuth } from '../../context/AuthContext';
import { FaTree } from 'react-icons/fa';
import { useTab } from '../../context/TabContext';
import logo from '../../assets/logo.png'
import { clearSession } from '../../utils/sessionUtils';

const Home = () => {
    const { activeTab, setActiveTab } = useTab();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            clearSession()
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'tree':
                return <TreeList userId={`${user.uid.slice(0,5)}${user.uid.slice(-5)}`} />;
            case 'badges':
                return <Badges />;
            case 'calendar':
                return <Calendar />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex space-x-8">
                            <div className="flex-shrink-0 flex items-center">
                                <img 
                                    src={logo} 
                                    alt="TreeDoctor Logo" 
                                    className="h-8 w-8 object-contain mr-2"
                                />
                                <span className="text-xl font-bold text-green-600">TreeDoctor</span>
                            </div>

                            <div className="hidden md:flex space-x-8">
                                {[
                                    { id: 'dashboard', name: 'Dashboard' },
                                    { id: 'tree', name: 'My Trees' },
                                    { id: 'badges', name: 'Badges' },
                                    { id: 'calendar', name: 'Calendar' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                            activeTab === tab.id
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User Profile Menu */}
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="block h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" />
                                )}
                            </button>

                            <Menu as="div" className="ml-3 relative">
                                <Menu.Button className="flex items-center space-x-3 hover:opacity-80">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8 text-green-600" />
                                    )}
                                    <span className="hidden md:block text-sm text-gray-700">
                                        {user?.displayName || user?.email || "Tree Doctor User"}
                                    </span>
                                </Menu.Button>

                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-100">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                                >
                                                    {user?.email}
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                                >
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <Transition
                        show={isMobileMenuOpen}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <div className="md:hidden">
                            <div className="pt-2 pb-3 space-y-1">
                                {[
                                    { id: 'dashboard', name: 'Dashboard' },
                                    { id: 'tree', name: 'My Trees' },
                                    { id: 'badges', name: 'Badges' },
                                    { id: 'calendar', name: 'Calendar' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`block w-full text-left px-3 py-2 text-base font-medium ${
                                            activeTab === tab.id
                                                ? 'text-green-600 bg-green-50'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Transition>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default Home;