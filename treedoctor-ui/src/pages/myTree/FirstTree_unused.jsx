import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../../../firebase';
import { collection, doc, getDoc, setDoc, Timestamp, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaSeedling } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import TreeList from './TreeList';
import { getDocs } from 'firebase/firestore';

const Tree = () => {
    const { user } = useAuth();
    const [hasTree, setHasTree] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [treeData, setTreeData] = useState({
        name: '',
        height: 0,
        image: null,
        message: ''
    });

    useEffect(() => {
        checkUserTree();
    }, [user]);

    const checkUserTree = async () => {
        if (!user) return;

        try {

            const userCollectionId = `${user.uid.slice(0,5)}${user.uid.slice(-5)}`;
            const treesRef = collection(db, 'userTrees', userCollectionId, 'trees');
            const querySnapshot = await getDocs(treesRef);
            
            const treesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setHasTree(treesList.length > 0)
        } catch (error) {
            console.error('Error fetching trees:', error);
        }
    };

    const phases = [
        {
            title: "Let's get started! What do you want to name your tree?",
            component: (
                <input
                    type="text"
                    value={treeData.name}
                    onChange={(e) => setTreeData({...treeData, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter tree name"
                />
            )
        },
        {
            title: "Wow! Nice name! Next, let's measure the height",
            component: (
                <div className="flex flex-col gap-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={treeData.height}
                        onChange={(e) => setTreeData({...treeData, height: e.target.value})}
                        className="w-full"
                    />
                    <input
                        type="number"
                        value={treeData.height}
                        onChange={(e) => setTreeData({...treeData, height: e.target.value})}
                        className="w-24 p-2 border rounded-md"
                    />
                </div>
            )
        },
        {
            title: "Here's to a future tall tree! Let's take a picture to remember his early days.",
            component: (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTreeData({...treeData, image: e.target.files[0]})}
                    className="w-full"
                />
            )
        },
        {
            title: "Lastly, is there anything you wish to put in your tree time capsule?",
            component: (
                <textarea
                    value={treeData.message}
                    onChange={(e) => setTreeData({...treeData, message: e.target.value})}
                    maxLength={250}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Write your message (250 characters max)"
                />
            )
        }
    ];

    const handleNext = () => {
        if (currentPhase < phases.length - 1) {
            setCurrentPhase(prev => prev + 1);
        } else {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const handleBack = () => {
        if (currentPhase > 0) {
            setCurrentPhase(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        if (!user) return;
        
        try {
            const userCollectionId = `${user.uid.slice(0,5)}${user.uid.slice(-5)}`;
            
            // Create reference to user's trees collection
            const treesRef = collection(db, 'userTrees', userCollectionId, 'trees');
            
            // Create tree document with unique ID
            const treeDoc = {
                name: treeData.name || 'My Tree',
                date: Timestamp.now(),
                height: parseInt(treeData.height) || 0,
                capsule: treeData.message || 'None',
                treeType: 'unknown',
                wateredTimes: 0,
                lastWatered: Timestamp.now()
            };

            // Add the document to the collection with auto-generated ID
            await addDoc(treesRef, treeDoc);
            setHasTree(true);
            
            // Show success confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error('Error creating tree:', error);
        }
    };

    if (hasTree) {
        return <TreeList userId={`${user.uid.slice(0,5)}${user.uid.slice(-5)}`} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <motion.div 
                className="bg-white rounded-lg shadow-xl p-8"
                style={{ width: '400px', height: '600px' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center justify-between h-full">
                    <FaSeedling className="text-6xl text-green-500" />
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPhase}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }}
                            className="flex flex-col items-center gap-4"
                        >
                            <h2 className="text-xl text-center font-semibold text-green-800">
                                {phases[currentPhase].title}
                            </h2>
                            {phases[currentPhase].component}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between w-full">
                        <button
                            onClick={handleBack}
                            disabled={currentPhase === 0}
                            className="px-4 py-2 bg-green-100 text-green-800 rounded-md disabled:opacity-50"
                        >
                            Back
                        </button>
                        {currentPhase === phases.length - 1 ? (
                            <button
                                onClick={handleComplete}
                                className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600"
                            >
                                Let's go!
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Tree;