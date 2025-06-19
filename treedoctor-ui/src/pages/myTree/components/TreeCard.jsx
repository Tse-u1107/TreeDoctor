import React, { useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { FaTree, FaSeedling, FaLeaf, FaHeart, FaStar } from 'react-icons/fa';
import { 
    faRuler, 
    faXmark,
    faDroplet, 
    faPlus,
    faTree,
    faMinus,
    faClock,
    faInfoCircle,
    faCalendar,
    faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import { Dialog, Transition, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactConfetti from 'react-confetti';
import { checkAndAwardBadges } from '../../../utils/badgeUtils';
import toast, { Toaster } from 'react-hot-toast';
import imageCompression from 'browser-image-compression'
import { faLeaf, faSkull, faCircleXmark, faHeartCrack } from '@fortawesome/free-solid-svg-icons';

const TreeCard = ({ trees, userId, updateTrigger }) => {
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [activeTreeId, setActiveTreeId] = useState(null);
    const [logData, setLogData] = useState({
        status: '',
        height: '',
        diameter: '',
        note: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [logImage, setLogImage] = useState(null);

    // Add new state for album modal
    const [isAlbumOpen, setIsAlbumOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Change initial state to false
    const [loadedImages, setLoadedImages] = useState(new Set());

    // Add new state for active tree
    const [activeTree, setActiveTree] = useState(null);

    // Add new state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const toggleCardActions = (treeId) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(treeId)) {
                newSet.delete(treeId);
            } else {
                newSet.add(treeId);
            }
            return newSet;
        });
    };

    const handleWaterTree = async (treeId) => {
        try {
            const treeRef = doc(db, 'userTrees', userId, 'trees', treeId);
            const treeDoc = await getDoc(treeRef);
            
            if (treeDoc.exists()) {
                const wateringDates = treeDoc.data().wateringDates || [];
                await setDoc(treeRef, {
                    ...treeDoc.data(),
                    wateringDates: [...wateringDates, new Date()],
                    lastWatered: new Date()
                }, { merge: true });
                
                await updateTrigger();
                await checkAndAwardBadges(userId, trees);
                toast.success('Tree watered successfully!');
            }
        } catch (error) {
            console.error('Error watering tree:', error);
            toast.error('Failed to record watering');
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setLogImage(file);
        }
    };

    const handleImageClick = () => {
        document.getElementById('logImageInput').click();
    };

    const handleImageInput = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setLogImage(file);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.128, // 128KB
            maxWidthOrHeight: 800,
            useWebWorker: true
        };
        
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let imageBase64 = null;
            if (logImage) {
                const compressedImage = await compressImage(logImage);
                imageBase64 = await convertToBase64(compressedImage);
            }

            const treeRef = doc(db, 'userTrees', userId, 'trees', activeTreeId);
            const treeDoc = await getDoc(treeRef);
            
            if (treeDoc.exists()) {
                const now = new Date();
                const updates = {
                    status: logData.status,
                    logs: [
                        ...(treeDoc.data().logs || []),
                        {
                            date: now,
                            note: logData.note,
                            status: logData.status,
                            diameter: parseInt(logData.diameter),
                            height: parseInt(logData.height),
                            picture: imageBase64
                        }
                    ]
                };
                
                await setDoc(treeRef, updates, { merge: true });
                await updateTrigger();
                toast.success('Tree log updated successfully!');
                setIsLogModalOpen(false);
                setLogImage(null);
            }
        } catch (error) {
            console.error('Error updating tree log:', error);
            toast.error('Failed to update tree log');
        }
    };

    // Add function to get most recent picture
    const getMostRecentPicture = (tree) => {
      // Check logs first
      const logsWithPictures = (tree.logs || [])
        .filter(log => log.picture)
        .sort((a, b) => b.date - a.date);
      
      if (logsWithPictures.length > 0) {
        return logsWithPictures[0].picture;
      }
      
      // If no log pictures, return the first initial picture
      return tree.pictures?.[0] || null;
    };

    // Add function to get most recent measurements
    const getMostRecentMeasurements = (tree) => {
        // Check logs first for both measurements
        const logsWithMeasurements = (tree.logs || [])
            .filter(log => log.height && log.diameter)
            .sort((a, b) => b.date - a.date);
        
        if (logsWithMeasurements.length > 0) {
            return {
                height: logsWithMeasurements[0].height,
                diameter: logsWithMeasurements[0].diameter,
                date: logsWithMeasurements[0].date
            };
        }
        
        // If no log measurements, return the initial measurements
        return {
            height: Object.values(tree.heights || {})[0] || 0,
            diameter: Object.values(tree.diameters || {})[0] || 0,
            date: tree.date
        };
    };

    // Update getAllPictures function to include more data
    const getAllPictures = (tree) => {
        const allPictures = [];
        
        if (tree.pictures) {
            tree.pictures.forEach((pic, index) => {
                allPictures.push({
                    url: pic,
                    date: tree.date,
                    type: 'Initial picture',
                    height: Object.values(tree.heights)[0] || 0,
                    diameter: Object.values(tree.diameters)[0] || 0,
                    note: tree.capsule || 'No initial note'
                });
            });
        }
        
        if (tree.logs) {
            tree.logs.forEach(log => {
                if (log.picture) {
                    allPictures.push({
                        url: log.picture,
                        date: log.date,
                        type: 'Log picture',
                        status: log.status,
                        height: log.height,
                        diameter: log.diameter,
                        note: log.note
                    });
                }
            });
        }
        
        return allPictures.sort((a, b) => b.date - a.date);
    };

    // Update the image loading handler in the Album Modal
    const handleImageLoad = (index) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            // Check if all images in the current page are loaded
            const currentPageImages = getAllPictures(activeTree)
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            
            if (newSet.size === currentPageImages.length) {
                setIsLoading(false);
            }
            return newSet;
        });
    };

    const handlePageChange = (pageNumber) => {
    //   setIsLoading(true);
      setLoadedImages(new Set());
      setCurrentPage(pageNumber);
    };

    return (
        <div className='grid grid-cols-1 gap-8'>
            {trees.map((tree) => (
                <motion.div
                    key={tree.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Main Card Content */}
                    <div className="p-4 md:p-8">
                        <div className="flex flex-col md:flex-row md:gap-8">
                            {/* Image section - with responsive classes */}
                            <div className="w-full md:w-48 mb-6 md:mb-0 relative group">
                                {getMostRecentPicture(tree) ? (
                                  <>
                                    <img
                                      src={getMostRecentPicture(tree)}
                                      alt={tree.name}
                                      className="w-full h-48 md:w-48 md:h-48 object-cover rounded-xl shadow-md"
                                    />
                                    <button
                                      onClick={() => {
                                        // setIsLoading(true);
                                        setLoadedImages(new Set());
                                        setActiveTree(tree);
                                        setIsAlbumOpen(true);
                                      }}
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                                 transition-opacity duration-300 rounded-xl flex items-center 
                                                 justify-center text-white font-medium"
                                    >
                                      See Album
                                    </button>
                                  </>
                                ) : (
                                    <div className="w-full h-48 md:w-48 md:h-48 bg-green-50 rounded-xl flex items-center justify-center mx-auto">
                                        <FaTree className="text-6xl text-green-300" />
                                    </div>
                                )}
                            </div>

                            {/* Tree Info - with responsive layout */}
                            <div className="flex-1 space-y-4 md:space-y-6">
                                {/* Tree Info Header */}
                                <div>
                                    <h2 className="text-2xl font-bold text-green-800 mb-3 text-center md:text-left">{tree.name}</h2>
                                    <div className="grid grid-cols-2 gap-4 text-green-600">
                                        {/* Tree Type */}
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTree} className="text-green-500" />
                                            <span className="text-sm md:text-base">{tree.treeType || 'Unknown'}</span>
                                        </div>
                                        
                                        {/* Planted Date */}
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCalendar} className="text-green-500" />
                                            <span className="text-sm md:text-base">
                                                Planted: {new Date(tree.date.seconds * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        {/* Last Logged */}
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faClipboardCheck} className="text-green-500" />
                                            <span className="text-sm md:text-base">
                                                {tree.logs && tree.logs.length > 0 
                                                    ? `Last log: ${new Date(tree.logs[tree.logs.length - 1].date.seconds * 1000).toLocaleDateString()}`
                                                    : 'No logs yet'}
                                            </span>
                                        </div>
                                        
                                        {/* Current Measurements */}
                                        {(() => {
                                            const measurements = getMostRecentMeasurements(tree);
                                            return (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faRuler} className="text-green-500" />
                                                        <span className="text-sm md:text-base">
                                                            Height: {measurements.height}cm
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faRuler} className="text-green-500 rotate-90" />
                                                        <span className="text-sm md:text-base">
                                                            Diameter: {measurements.diameter}cm
                                                        </span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                        
                                        {/* Watering Count */}
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faDroplet} className="text-green-500" />
                                            <span className="text-sm md:text-base">
                                                Watered: {((tree.wateringDates || []).length)} times
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                                {/* Log Actions Button */}
                                <button
                                    onClick={() => toggleCardActions(tree.id)}
                                    className="w-full py-3 px-4 rounded-lg bg-green-50 hover:bg-green-100 
                                                transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon 
                                        icon={expandedCards.has(tree.id) ? faMinus : faPlus} 
                                        className="text-green-600" 
                                    />
                                    <span className="font-medium text-green-700">
                                        {expandedCards.has(tree.id) ? 'Hide Actions' : 'Actions'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Actions Section */}
                    <AnimatePresence>
                        {expandedCards.has(tree.id) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-green-100"
                            >
                                <div className="grid grid-cols-2 gap-4 p-6 bg-green-50">
                                    {/* Log Tree Button */}
                                    <button
                                        onClick={() => {
                                            setActiveTreeId(tree.id);
                                            setIsLogModalOpen(true);
                                            setLogData({
                                                status: '',
                                                height: Object.values(tree.heights || {}).pop() || '',
                                                diameter: Object.values(tree.diameters || {}).pop() || '',
                                                note: ''
                                            });
                                        }}
                                        className="flex flex-col items-center justify-center gap-3 p-6 
                                                    bg-white rounded-xl shadow-sm hover:shadow-md 
                                                    transition-all duration-200 hover:scale-105"
                                    >
                                        <FontAwesomeIcon 
                                            icon={faRuler} 
                                            className="text-4xl text-green-600" 
                                        />
                                        <div className="text-center">
                                            <div className="font-semibold text-green-800">Log Your Tree</div>
                                        </div>
                                    </button>

                                    {/* Water Tree Button */}
                                    <button
                                        onClick={() => handleWaterTree(tree.id)}
                                        className="flex flex-col items-center justify-center gap-3 p-6 
                                                   bg-white rounded-xl shadow-sm hover:shadow-md 
                                                   transition-all duration-200 hover:scale-105"
                                    >
                                        <FontAwesomeIcon 
                                            icon={faDroplet} 
                                            className="text-4xl text-blue-600" 
                                        />
                                        <div className="text-center">
                                            <div className="font-semibold text-blue-800">Water Tree</div>
                                            <div className="text-sm text-blue-600">
                                                Watered: {(tree.wateringDates || []).length} times
                                            </div>
                                        </div>
                                    </button>
                                    <div className='flex items-center px-2'>
                                        <FontAwesomeIcon 
                                            icon={faInfoCircle}
                                            className='mr-2'
                                        />
                                        <p className="text-xs text-gray-600">
                                            A tree should be logged every few months or so. Click the Log button to log your tree!
                                        </p>
                                    </div>
                                    <div className='flex items-center px-2'>
                                        <FontAwesomeIcon 
                                            icon={faInfoCircle}
                                            className='mr-2'
                                        />
                                        <p className="text-xs text-gray-600 mt-2">
                                            A tree needs 4-6 litres of water per watering. Click the water button to log one watering!
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}

            {/* Log Tree Status Modal */}
            {isLogModalOpen && (
                <Dialog
                    as={motion.div}
                    static
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={isLogModalOpen}
                    onClose={() => setIsLogModalOpen(false)}
                    
                    className="fixed inset-0 z-50 overflow-y-auto"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                            <button
                                onClick={() => {
                                    setIsLogModalOpen(false);
                                    setActiveTree(null);
                                }}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center 
                                        rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
                            </button>
                            <Dialog.Title className="text-2xl font-bold text-green-800 mb-6">
                                Log Tree Status
                            </Dialog.Title>

                            <form onSubmit={handleLogSubmit} className="space-y-6">
                                {/* Tree Status Buttons */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tree Status
                                    </label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { status: 'healthy', icon: faLeaf, color: 'text-green-600' },
                                            { status: 'damaged', icon: faHeartCrack, color: 'text-yellow-600' },
                                            { status: 'wizened', icon: faCircleXmark, color: 'text-orange-600' },
                                            { status: 'dead', icon: faSkull, color: 'text-red-600' }
                                        ].map(({ status, icon, color }) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setLogData(prev => ({ ...prev, status }))}
                                                className={`py-4 rounded-lg border-2 transition-all justify-center ${
                                                    logData.status === status 
                                                        ? 'border-green-500 bg-green-50' 
                                                        : 'border-gray-200 hover:border-green-200'
                                                }`}
                                            >
                                                    <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />

                                                <div>
                                                    <p className={`text-sm ${logData.status === status
                                                        ? 'text-green-600'
                                                        : 'text-grey-600'
                                                    }`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Height Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={logData.height}
                                        onChange={(e) => setLogData(prev => ({ ...prev, height: e.target.value }))}
                                        className="w-full p-3 border border-green-200 rounded-lg"
                                        placeholder="Enter new height"
                                    />
                                </div>

                                {/* Diameter Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Diameter (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={logData.diameter}
                                        onChange={(e) => setLogData(prev => ({ ...prev, diameter: e.target.value }))}
                                        className="w-full p-3 border border-green-200 rounded-lg"
                                        placeholder="Enter new diameter"
                                    />
                                </div>

                                {/* Note Textarea */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Log Note
                                    </label>
                                    <textarea
                                        value={logData.note}
                                        onChange={(e) => setLogData(prev => ({ ...prev, note: e.target.value }))}
                                        maxLength={500}
                                        className="w-full p-3 border border-green-200 rounded-lg h-24"
                                        placeholder="Add notes about your tree's condition (500 characters max)"
                                    />
                                    <p className={`text-sm mt-1 ${
                                        logData.note.length > 450 ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {logData.note.length}/500 characters
                                    </p>
                                </div>

                                {/* Log Picture */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Log Picture
                                    </label>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={handleImageClick}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                                          isDragging 
                                            ? 'bg-green-50 border-green-500 scale-105' 
                                            : 'border-green-200 hover:bg-green-50 hover:border-green-300'
                                        }`}
                                    >
                                        <input
                                            id="logImageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageInput}
                                            className="hidden"
                                        />
                                        {logImage ? (
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(logImage)}
                                                    alt="Log upload"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLogImage(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                >
                                                ×
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                Drop an image here or click to select
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsLogModalOpen(false)}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                                 transform hover:scale-105 transition-all duration-300 shadow-md"
                                    >
                                        Save Log
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

            {/* Album Modal */}
            {isAlbumOpen && activeTree && (
                <Dialog
                    as={motion.div}
                    static
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={isAlbumOpen}
                    onClose={() => {
                        setIsAlbumOpen(false);
                        setActiveTree(null);
                    }}
                    className="fixed inset-0 z-50 overflow-y-auto"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full mx-4">
                                                        <button
                                onClick={() => {
                                    setIsLogModalOpen(false);
                                    setActiveTree(null);
                                }}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center 
                                        rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
                            </button>
                            <Dialog.Title className="text-2xl font-bold text-green-800 mb-6">
                                {activeTree.name}'s Growth Journey
                            </Dialog.Title>

                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                    <FontAwesomeIcon 
                                        icon={faLeaf} 
                                        className="text-4xl text-green-500 animate-spin" 
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                        {getAllPictures(activeTree)
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((pic, index) => (
                                            <div key={index} className="bg-green-50/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                                    <span>{new Date(pic.date.seconds * 1000).toLocaleDateString()}</span>
                                                    <span className="italic text-green-600">{pic.type}</span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-1">
                                                        <img
                                                            src={pic.url}
                                                            alt={`${activeTree.name} - ${index + 1}`}
                                                            className="w-full aspect-square object-cover rounded-lg shadow-md"
                                                            onLoad={() => handleImageLoad()}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    
                                                    <div className="col-span-2 space-y-3">
                                                        <div className="flex gap-4">
                                                            <div className="flex items-center gap-2 text-green-700">
                                                                <FontAwesomeIcon icon={faRuler} />
                                                                <span>{pic.height}cm</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-green-700">
                                                                <FontAwesomeIcon icon={faRuler} className="rotate-90" />
                                                                <span>{pic.diameter}cm</span>
                                                            </div>
                                                            {pic.status && (
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        pic.status === 'healthy' ? 'bg-green-100 text-green-700' :
                                                                        pic.status === 'damaged' ? 'bg-yellow-100 text-yellow-700' :
                                                                        pic.status === 'wizened' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                        {pic.status}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <p className="text-gray-600 text-sm bg-white/50 rounded-lg p-3">
                                                            {pic.note || 'No notes added'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {getAllPictures(activeTree).length > itemsPerPage && (
                                        <div className="flex justify-center gap-2 mt-6">
                                            {Array.from({ length: Math.ceil(getAllPictures(activeTree).length / itemsPerPage) })
                                                .map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(index + 1)}
                                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                                            currentPage === index + 1
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default TreeCard