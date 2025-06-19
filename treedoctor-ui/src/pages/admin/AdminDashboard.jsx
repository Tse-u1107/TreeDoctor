import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faTree,
    faChevronDown,
    faChevronUp,
    faDroplet,
    faRuler,
    faCalendar,
    faClipboardCheck 
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { getAuth } from 'firebase/auth';
import { clearSession } from '../../utils/sessionUtils';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userTrees, setUserTrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUsers, setExpandedUsers] = useState(new Set());
    const auth = getAuth();

    useEffect(() => {
        // Check if user is admin
        if (!user || user.email !== "admin.treedoctor@gmail.com") {
            navigate('/home');
            return;
        }

        const fetchAllUserTrees = async () => {
            try {
                // Get the userTrees collection

                const test =await getDocs(collection(db, 'yourCollection'))
                const test2 = await getDocs(collection(db, 'userTrees'))
                console.log(test, test2)
                const usersRef = collection(db, 'userTrees');
                const usersSnapshot = await getDocs(usersRef);
                const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
                    const uuid = userDoc.id;
                    const treesRef = collection(db, 'userTrees', uuid, 'trees');
                    const treesSnapshot = await getDocs(treesRef);
                    
                    // Get all trees for this user
                    const trees = treesSnapshot.docs.map(treeDoc => ({
                        id: treeDoc.id,
                        ...treeDoc.data()
                    }));

                    return {
                        userId: uuid,
                        trees: trees,
                        totalTrees: trees.length
                    };
                }));

                setUserTrees(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user trees:', error);
                setLoading(false);
            }
        };

        fetchAllUserTrees();
    }, [user, navigate]);

    const toggleUserExpand = (userId) => {
        setExpandedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            clearSession();
            navigate('/auth');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        {/* Logo and Title */}
                        <div className="flex items-center">
                            <FontAwesomeIcon 
                                icon={faTree} 
                                className="text-2xl text-green-600 mr-2" 
                            />
                            <span className="text-xl font-bold text-green-600">
                                TreeDoctor Admin
                            </span>
                        </div>

                        {/* User Profile Menu */}
                        <div className="flex items-center">
                            <Menu as="div" className="ml-3 relative">
                                <Menu.Button className="flex items-center space-x-3 hover:opacity-80">
                                    <UserCircleIcon className="h-8 w-8 text-green-600" />
                                    <span className="hidden md:block text-sm text-gray-700">
                                        Admin
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
                                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
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
                </div>
            </nav>

            {/* Main Content */}
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Admin Dashboard</h1>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{userTrees.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FontAwesomeIcon icon={faTree} className="text-2xl text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Trees</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {userTrees.reduce((sum, user) => sum + user.totalTrees, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Cards Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {userTrees.map(userData => (
                        <div key={userData.userId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* User Header */}
                            <button 
                                onClick={() => toggleUserExpand(userData.userId)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FontAwesomeIcon icon={faUsers} className="text-xl text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-800">User ID: {userData.userId}</h3>
                                        <p className="text-sm text-gray-600">
                                            {userData.totalTrees} trees
                                        </p>
                                    </div>
                                </div>
                                <FontAwesomeIcon 
                                    icon={expandedUsers.has(userData.userId) ? faChevronUp : faChevronDown}
                                    className="text-gray-400"
                                />
                            </button>

                            {/* Expandable Tree Details */}
                            <AnimatePresence>
                                {expandedUsers.has(userData.userId) && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 bg-gray-50 space-y-4">
                                            {userData.trees.map(tree => (
                                                <div key={tree.id} className="bg-white p-4 rounded-lg shadow">
                                                    <h4 className="font-semibold text-green-800 mb-2">{tree.name}</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCalendar} className="text-green-500" />
                                                            <span className="text-sm">
                                                                Planted: {new Date(tree.date.seconds * 1000).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
                                                            <span className="text-sm">
                                                                Watered: {(tree.wateringDates || []).length} times
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faClipboardCheck} className="text-yellow-500" />
                                                            <span className="text-sm">
                                                                Logs: {(tree.logs || []).length}
                                                            </span>
                                                        </div>
                                                        {tree.logs && tree.logs.length > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faRuler} className="text-purple-500" />
                                                                <span className="text-sm">
                                                                    Current Height: {tree.logs[tree.logs.length - 1].height}cm
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;