import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSeedling, 
    faChartLine, 
    faMedal,
    faTree,
    faRuler,
    faDroplet,
    faClock,
    faCalendarWeek,
    faCalendar
} from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { badgeCategories } from '../../config/badges';
import { useTab } from '../../context/TabContext';
import { Navigation } from 'swiper/modules';

const MOCK_TREES = [
    {
        id: 'preview-1',
        name: 'Cherry Blossom',
        treeType: 'Sakura',
        date: new Date('2025-01-15'),
        picture: null,
        heights: {
            '2025-01-15': 10,
            '2025-02-15': 15,
            '2025-03-15': 25,
            '2025-04-15': 35,
            '2025-05-15': 45
        },
        wateringDates: Array(12).fill(null)
    },
    {
        id: 'preview-2',
        name: 'Mighty Oak',
        treeType: 'Oak',
        date: new Date('2025-02-01'),
        picture: null,
        heights: {
            '2025-02-01': 8,
            '2025-03-01': 12,
            '2025-04-01': 20,
            '2025-05-01': 30,
            '2025-06-01': 40
        },
        wateringDates: Array(8).fill(null)
    }
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];



const formatDateKey = (date) => {
    // Ensure we handle both Date objects and Firebase timestamps
    const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    
    // Use local timezone for consistent date representation
    return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate()
    ).toISOString().split('T')[0];
};

// Add this helper function at the top level
const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
        start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
};

const Dashboard = ({ isPreview = false }) => {

    const { activeTab, setActiveTab } = useTab()
    const { user } = useAuth();
    const [trees, setTrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [events, setEvents] = useState({});

    // Modified fetchTrees function to match TreeList's data structure
    const fetchTrees = async () => {
        try {
            const treesRef = collection(db, 'userTrees', `${user.uid.slice(0,5)}${user.uid.slice(-5)}`, 'trees');
            const querySnapshot = await getDocs(treesRef);

            const treesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore timestamp to Date
                date: doc.data().date?.toDate(),
                lastWatered: doc.data().lastWatered?.toDate()
            }));
            setTrees(treesList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trees:', error);
            setLoading(false);
        }
    };
    const [currentDate, setCurrentDate] = useState(new Date());

    const generateWeekData = (baseDate) => {
        const startOfWeek = new Date(baseDate);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
        
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    };

    const generateWeeks = () => {
        const weeks = [];
        for (let i = -2; i <= 2; i++) {
            const baseDate = new Date(currentDate);
            // Adjust to start of week
            baseDate.setDate(baseDate.getDate() - baseDate.getDay());
            // Then add week offset
            baseDate.setDate(baseDate.getDate() + (i * 7));
            weeks.push(generateWeekData(baseDate));
        }
        return weeks;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) return;
            
            try {
                const processedEvents = {};
                const treesRef = collection(db, 'userTrees', `${user.uid.slice(0,5)}${user.uid.slice(-5)}`, 'trees');
                const treesSnapshot = await getDocs(treesRef);

                treesSnapshot.forEach((doc) => {
                    const tree = doc.data();

                    // Process planting date
                    if (tree.date) {
                        const plantedDate = formatDateKey(tree.date);
                        processedEvents[plantedDate] = [
                            ...(processedEvents[plantedDate] || []),
                            { type: 'plant', tree: tree.name }
                        ];
                    }

                    // Process watering dates
                    if (tree.wateringDates) {
                        tree.wateringDates.forEach(waterDate => {
                            const date = formatDateKey(waterDate);
                            processedEvents[date] = [
                                ...(processedEvents[date] || []),
                                { type: 'water', tree: tree.name }
                            ];
                        });
                    }

                    // Process logs with measurements
                    if (tree.logs) {
                        tree.logs.forEach(log => {
                            if (log.date) {
                                const date = formatDateKey(log.date);
                                processedEvents[date] = [
                                    ...(processedEvents[date] || []),
                                    { 
                                        type: 'measure', 
                                        tree: tree.name,
                                        height: log.height,
                                        diameter: log.diameter,
                                        status: log.status
                                    }
                                ];
                            }
                        });
                    }
                });

                setEvents(processedEvents);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            }
        };

        fetchEvents();
    }, [user]);



    useEffect(() => {
        fetchTrees();
    }, [user]);

    // Add new useEffect for fetching badges
    useEffect(() => {
        const fetchBadges = async () => {
            if (!user) return;
            
            try {
                const userCollectionId = `${user.uid.slice(0,5)}${user.uid.slice(-5)}`;
                const badgesRef = collection(db, 'userTrees', userCollectionId, 'badges');
                const snapshot = await getDocs(badgesRef);
                
                const badges = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEarnedBadges(badges.map(badge => badge.id));
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        fetchBadges();
    }, [user]);

    // Add these helper functions after the existing ones

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

        console.log(tree)

        // Check logs first for both measurements
        const logsWithMeasurements = (tree.logs || [])
            .filter(log => log.height && log.diameter)
            .sort((a, b) => b.date - a.date);
        
        if (logsWithMeasurements.length > 0) {
            return {
                height: logsWithMeasurements[0].height,
                diameter: logsWithMeasurements[0].diameter,
                date: logsWithMeasurements[0].date,
                lastLog: new Date(logsWithMeasurements[logsWithMeasurements.length-1].date.seconds * 1000).toLocaleDateString(),
            };
        }
        
        // If no log measurements, return the initial measurements
        return {
            height: Object.values(tree.heights || {})[0] || 0,
            diameter: Object.values(tree.diameters || {})[0] || 0,
            date: tree.date,
            lastLog: 'Not available'
        };
    };

// Update formatGrowthData to handle both height and diameter
const formatGrowthData = (trees) => {
    const allDates = new Set();
    
    // Collect all dates from logs
    trees.forEach(tree => {
        if (tree.logs) {
            tree.logs.forEach(log => {
                if (log.height || log.diameter) {
                    allDates.add(log.date.seconds * 1000);
                }
            });
        }
    });

    // Convert to sorted array
    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map(timestamp => {
        const date = new Date(timestamp);
        const dataPoint = {
            date: date.toLocaleDateString()
        };

        trees.forEach((tree) => {
            const treeName = tree.name || 'Unknown Tree';
            const log = tree.logs?.find(l => l.date.seconds * 1000 === timestamp);
            
            if (log) {
                if (log.height) dataPoint[`${treeName} (Height)`] = log.height;
                if (log.diameter) dataPoint[`${treeName} (Diameter)`] = log.diameter;
            }
        });

        return dataPoint;
    });
};

    // Get recent badges (last 4 earned)
    const getRecentBadges = () => {
        const allBadges = [];
        Object.values(badgeCategories).forEach(category => {
            category.badges.forEach(badge => {
                if (earnedBadges.includes(badge.id)) {
                    allBadges.push({
                        ...badge,
                        category: category.title
                    });
                }
            });
        });
        
        // Return most recent 4 badges
        return allBadges.slice(-4);
    };

    // Replace the hardcoded badges array with getRecentBadges()
    const recentBadges = getRecentBadges();

    // Skip data fetching if in preview mode
    if (isPreview) {
        return (
            <div className="">
                {/* Trees List Section */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faTree} className="text-2xl text-green-800" />
                        <h2 className="text-2xl font-bold text-green-800">My Trees</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {MOCK_TREES.map(tree => (
                            <div key={tree.id} className="bg-white rounded-lg p-4 shadow">
                                {tree.picture ? (
                                    <img 
                                        src={tree.picture}
                                        alt={tree.name}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-green-100 rounded-lg mb-3 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faSeedling} className="text-4xl text-green-400" />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-green-700">{tree.name || 'My Tree'}</h3>
                                <div className="space-y-2 mt-2">
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faTree} className="text-green-600" />
                                        <span>Type: {tree.treeType || 'Unknown'}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faClock} className="text-green-600" />
                                        <span>Planted: {tree.date ? tree.date.toLocaleDateString() : 'Recently'}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faRuler} className="text-green-600" />
                                        <span>Height: {Object.values(tree.heights || {}).pop() || 0} cm</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faDroplet} className="text-green-600" />
                                        <span>Watered: {(tree.wateringDates || []).length} times</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Chart Section - Now in full width */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-800" />
                        <h2 className="text-2xl font-bold text-green-800">Growth</h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <LineChart 
                            width={600} // Increased width for better visibility
                            height={300} // Adjusted height
                            data={formatGrowthData(MOCK_TREES)}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis label={{ value: 'Height (cm)', angle: -90 }} />
                            <Tooltip />
                            {MOCK_TREES.map((tree, index) => (
                                <Line 
                                    key={tree.id}
                                    type="monotone" 
                                    dataKey={tree.name || `Tree ${index + 1}`}
                                    stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`} // Generate distinct colors
                                    dot={{ r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </div>
                    {/* Add legend for multiple trees */}
                    <div className="mt-4 flex flex-wrap gap-4">
                        {MOCK_TREES.map((tree, index) => (
                            <div 
                                key={tree.id} 
                                className="flex items-center gap-2"
                            >
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
                                />
                                <span className="text-sm text-green-800">
                                    {tree.name || `Tree ${index + 1}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faCalendarWeek} className="text-2xl text-green-800" />
                        <h2 className="text-2xl font-bold text-green-800">Weekly Calendar</h2>
                    </div>
                    <div className="text-sm text-green-600 font-medium mb-4">
                        {getWeekRange(currentDate).start} - {getWeekRange(currentDate).end}
                    </div>
                    
                    {trees.length > 0 ? (
                        <div className="grid grid-cols-7 gap-2">
                            {generateWeekData(currentDate).map((date) => {
                                const dateKey = formatDateKey(date);
                                const isToday = formatDateKey(new Date()) === dateKey;
                                const dayEvents = events[dateKey] || [];

                                return (
                                    <div 
                                        key={dateKey}
                                        className={`p-3 rounded-xl ${
                                            isToday 
                                                ? 'bg-green-100 border-2 border-green-500' 
                                                : 'bg-white border border-gray-200'
                                        }`}
                                    >
                                        <div className="text-center mb-2">
                                            <p className="text-xs text-gray-500">{DAYS_OF_WEEK[date.getDay()]}</p>
                                            <p className={`text-lg font-bold ${
                                                isToday ? 'text-green-600' : 'text-gray-800'
                                            }`}>
                                                {date.getDate()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            {dayEvents.map((event, index) => (
                                                <div key={index} 
                                                    className="tooltip relative group"
                                                    title={`${event.tree}: ${event.type}`}
                                                >
                                                    {event.type === 'water' && (
                                                        <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
                                                    )}
                                                    {event.type === 'measure' && (
                                                        <FontAwesomeIcon icon={faRuler} className="text-yellow-500" />
                                                    )}
                                                    {event.type === 'plant' && (
                                                        <FontAwesomeIcon icon={faSeedling} className="text-green-500" />
                                                    )}
                                                    <div className="tooltiptext text-xs bg-gray-800 text-white px-2 py-1 rounded 
                                                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap 
                                                                opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {event.tree}: {event.type}
                                                        {event.type === 'measure' && (
                                                            <><br />
                                                            Height: {event.height}cm<br />
                                                            Diameter: {event.diameter}cm
                                                            {event.status && <><br />Status: {event.status}</>}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <FontAwesomeIcon icon={faCalendarWeek} className="text-2xl text-green-600" />
                            </div>
                            <p className="text-gray-600">Plant your first tree to see events!</p>
                        </div>
                    )}
                </div>

                {/* Badges Section */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMedal} className="text-2xl text-green-800" />
                            <h2 className="text-2xl font-bold text-green-800">Recent Achievements</h2>
                        </div>
                        {earnedBadges.length > 4 && (
                            <Link 
                                to="/badges"
                                className="text-green-600 hover:text-green-700 text-sm"
                            >
                                View All ({earnedBadges.length})
                            </Link>
                        )}
                    </div>
                    
                    {recentBadges.length > 0 ? (
                        <div className="px-8"> {/* Added padding for arrow spacing */}
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={24}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                pagination={{ 
                                    clickable: true,
                                    dynamicBullets: true
                                }}
                                breakpoints={{
                                    // Mobile first approach
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 }
                                }}
                                className="py-4" // Added vertical padding
                            >
                                {recentBadges.map(badge => (
                                    <SwiperSlide key={badge.id}>
                                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 
                                                    rounded-lg shadow hover:shadow-md transition-shadow duration-300
                                                    mx-2" // Added horizontal margin
                                        >
                                            <FontAwesomeIcon 
                                                icon={badge.icon} 
                                                className="text-4xl text-green-600 mb-4" // Increased margin
                                            />
                                            <h3 className="font-bold text-lg text-green-700 mb-3">{badge.name}</h3>
                                            <p className="text-sm text-green-600 mb-3">{badge.description}</p>
                                            <span className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-full">
                                                {badge.category}
                                            </span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                                <div className="swiper-button-prev !text-green-600 !w-8 !h-8 
                                            after:!text-2xl hover:!text-green-700 transition-colors" />
                                <div className="swiper-button-next !text-green-600 !w-8 !h-8 
                                            after:!text-2xl hover:!text-green-700 transition-colors" />
                            </Swiper>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FontAwesomeIcon icon={faSeedling} className="text-4xl mb-2" />
                            <p>Start caring for your trees to earn badges!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const handlePlantTree = () => {
        setActiveTab('tree')
    };

    return (
        <div className="">
            {/* Trees List Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faTree} className="text-2xl text-green-800" />
                    <h2 className="text-2xl font-bold text-green-800">My Trees</h2>
                </div>
                {trees.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {trees.map(tree => (
                            <div key={tree.id} className="bg-white rounded-lg p-4 shadow">
                                {getMostRecentPicture(tree) ? (
                                    <img 
                                        src={getMostRecentPicture(tree)}
                                        alt={tree.name}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-green-100 rounded-lg mb-3 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faSeedling} className="text-4xl text-green-400" />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-green-700">{tree.name || 'My Tree'}</h3>
                                <div className="space-y-2 mt-2 text-black-600">
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faTree} className="text-green-600" />
                                        <span>Type: {tree.treeType || 'Unknown'}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCalendar} className="text-green-600" />
                                        <span>Planted: {tree.date.toLocaleDateString()}</span>
                                    </p>
                                    {(() => {
                                        const measurements = getMostRecentMeasurements(tree);
                                        return (
                                            <>
                                                <p className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faRuler} className="text-green-600" />
                                                    <span>
                                                        Height: {measurements.height}cm
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            (Last logged: {measurements.lastLog})
                                                        </span>
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faRuler} className="text-green-600 rotate-90" />
                                                    <span>
                                                        Diameter: {measurements.diameter}cm
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            (Last logged: {measurements.lastLog})
                                                        </span>
                                                    </span>
                                                </p>
                                            </>
                                        );
                                    })()}
                                    <p className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faDroplet} className="text-green-600" />
                                        <span>Watered: {(tree.wateringDates || []).length} times</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                                <FontAwesomeIcon icon={faSeedling} className="text-4xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">Plant Your First Tree</h3>
                            <p className="text-gray-600 mb-6">Start your journey by planting your first tree!</p>
                            <button
                                onClick={handlePlantTree}
                                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faTree} />
                                <span>Plant a Tree</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Growth Chart Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-800" />
                    <h2 className="text-2xl font-bold text-green-800">Growth</h2>
                </div>
                {trees.length > 0 ? (
                    <>
                        <div className="space-y-8">
                            {/* Height Chart */}
                            <div>
                                <h3 className="text-lg font-semibold text-green-700 mb-4">Height Progress</h3>
                                <div className="w-full overflow-x-auto">
                                    <LineChart 
                                        width={600}
                                        height={300}
                                        data={formatGrowthData(trees)}
                                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis label={{ value: 'Height (cm)', angle: -90 }} />
                                        <Tooltip />
                                        {trees.map((tree, index) => (
                                            <Line 
                                                key={`${tree.id}-height`}
                                                type="monotone" 
                                                dataKey={`${tree.name || `Tree ${index + 1}`} (Height)`}
                                                stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                                                dot={{ r: 6 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        ))}
                                    </LineChart>
                                </div>
                            </div>

                            {/* Diameter Chart */}
                            <div>
                                <h3 className="text-lg font-semibold text-green-700 mb-4">Diameter Progress</h3>
                                <div className="w-full overflow-x-auto">
                                    <LineChart 
                                        width={600}
                                        height={300}
                                        data={formatGrowthData(trees)}
                                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis label={{ value: 'Diameter (cm)', angle: -90 }} />
                                        <Tooltip />
                                        {trees.map((tree, index) => (
                                            <Line 
                                                key={`${tree.id}-diameter`}
                                                type="monotone" 
                                                dataKey={`${tree.name || `Tree ${index + 1}`} (Diameter)`}
                                                stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                                                dot={{ r: 6 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        ))}
                                    </LineChart>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap gap-4">
                            {trees.map((tree, index) => (
                                <div 
                                    key={tree.id} 
                                    className="flex items-center gap-2"
                                >
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
                                    />
                                    <span className="text-sm text-green-800">
                                        {tree.name || `Tree ${index + 1}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-600" />
                        </div>
                        <p className="text-gray-600">Plant your first tree to see growth charts!</p>
                    </div>
                )}
            </div>

            {/* Weekly Calendar Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faCalendarWeek} className="text-2xl text-green-800" />
                    <h2 className="text-2xl font-bold text-green-800">Weekly Calendar</h2>
                </div>
                <div className="text-sm text-green-600 font-medium mb-4">
                    {getWeekRange(currentDate).start} - {getWeekRange(currentDate).end}
                </div>
                
                {trees.length > 0 ? (
                    <div className="grid grid-cols-7 gap-2">
                        {generateWeekData(currentDate).map((date) => {
                            const dateKey = formatDateKey(date);
                            const isToday = formatDateKey(new Date()) === dateKey;
                            const dayEvents = events[dateKey] || [];

                            return (
                                <div 
                                    key={dateKey}
                                    className={`p-3 rounded-xl ${
                                        isToday 
                                            ? 'bg-green-100 border-2 border-green-500' 
                                            : 'bg-white border border-gray-200'
                                    }`}
                                >
                                    <div className="text-center mb-2">
                                        <p className="text-xs text-gray-500">{DAYS_OF_WEEK[date.getDay()]}</p>
                                        <p className={`text-lg font-bold ${
                                            isToday ? 'text-green-600' : 'text-gray-800'
                                        }`}>
                                            {date.getDate()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {dayEvents.map((event, index) => (
                                            <div key={index} title={event.tree} className="tooltip">
                                                {event.type === 'water' && (
                                                    <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
                                                )}
                                                {event.type === 'measure' && (
                                                    <FontAwesomeIcon icon={faRuler} className="text-yellow-500" />
                                                )}
                                                {event.type === 'plant' && (
                                                    <FontAwesomeIcon icon={faSeedling} className="text-green-500" />
                                                )}
                                                <span className="tooltiptext text-xs">
                                                    {event.tree}: {event.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <FontAwesomeIcon icon={faCalendarWeek} className="text-2xl text-green-600" />
                        </div>
                        <p className="text-gray-600">Plant your first tree to see events!</p>
                    </div>
                )}
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faMedal} className="text-2xl text-green-800" />
                        <h2 className="text-2xl font-bold text-green-800">Recent Achievements</h2>
                    </div>
                    {earnedBadges.length > 4 && (
                        <button 
                            onClick={() => setActiveTab('badges')}
                            className="text-green-600 hover:text-green-700 text-sm"
                        >
                            View All ({earnedBadges.length})
                        </button>
                    )}
                </div>
                
                {recentBadges.length > 0 ? (
                    <div className="px-8"> {/* Added padding for arrow spacing */}
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={24}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            pagination={{ 
                                clickable: true,
                                dynamicBullets: true
                            }}
                            breakpoints={{
                                // Mobile first approach
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 }
                            }}
                            className="py-4" // Added vertical padding
                        >
                            {recentBadges.map(badge => (
                                <SwiperSlide key={badge.id}>
                                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 
                                                    rounded-lg shadow hover:shadow-md transition-shadow duration-300
                                                    mx-2 h-[280px] flex flex-col justify-between" // Added fixed height and flex layout
                                    >
                                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                            <FontAwesomeIcon 
                                                icon={badge.icon} 
                                                className="text-4xl text-green-600"
                                            />
                                            <h3 className="font-bold text-lg text-green-700">{badge.name}</h3>
                                            <p className="text-sm text-green-600 line-clamp-2">{badge.description}</p>
                                        </div>
                                        <span className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-full mt-auto">
                                            {badge.category}
                                        </span>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="swiper-button-prev !text-green-600 !w-8 !h-8 
                                         after:!text-2xl hover:!text-green-700 transition-colors" />
                            <div className="swiper-button-next !text-green-600 !w-8 !h-8 
                                         after:!text-2xl hover:!text-green-700 transition-colors" />
                        </Swiper>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FontAwesomeIcon icon={faSeedling} className="text-4xl mb-2" />
                        <p>Start caring for your trees to earn badges!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;