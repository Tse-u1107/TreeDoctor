import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import TreeGuideImg from '../../../assets/TreeGuide.jpg';

const TreeGuideButton = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Add this handler to prevent form submission
    const handleClick = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="w-full">
            <button
                type="button" // Add this to explicitly make it a button type
                onClick={handleClick}
                className="w-full flex items-center justify-between p-3 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
                <div>
                    <FontAwesomeIcon 
                        icon={faInfoCircle} 
                        className="mx-1"
                    />
                    See Tree Type Guide
                </div>
                <FontAwesomeIcon 
                    icon={isExpanded ? faChevronUp : faChevronDown} 
                    className="ml-2"
                />
            </button>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                        <img 
                            src={TreeGuideImg} 
                            alt="Tree Type Guide" 
                            className="w-full h-auto cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                        />
                        <div className="p-4 bg-green-50">
                            <p className="text-sm text-gray-800">
                                This guide shows common tree types in Mongolia. 
                                Click the image to view in full size.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full-size image modal */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <motion.img
                            src={TreeGuideImg}
                            alt="Tree Type Guide Full Size"
                            className="max-w-full max-h-[90vh] object-contain"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TreeGuideButton;