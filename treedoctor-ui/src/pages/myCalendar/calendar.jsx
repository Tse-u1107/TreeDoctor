import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDroplet, 
    faRuler, 
    faSeedling,
    faCalendarWeek,
    faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import ProtectedRoute from '../../components/ProtectedRoute';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { getAuth } from '@firebase/auth';
import { useAuth } from '../../context/AuthContext';
// import { db } from '../../firebase'; // Adjust the import based on your file structure

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

const WeeklyView = ({ currentDate, events }) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    return (
        <div className="grid grid-cols-7 gap-4">
            {weekDays.map((date) => {
                const dateKey = formatDateKey(date);
                const isToday = formatDateKey(new Date()) === dateKey;
                const dayEvents = events[dateKey] || [];

                return (
                    <div 
                        key={dateKey}
                        className={`p-4 rounded-xl ${
                            isToday 
                                ? 'bg-green-100 border-2 border-green-500' 
                                : 'bg-white border border-gray-200'
                        }`}
                    >
                        <div className="text-center mb-2">
                            <p className="text-sm text-gray-500">{DAYS_OF_WEEK[date.getDay()]}</p>
                            <p className={`text-2xl font-bold ${
                                isToday ? 'text-green-600' : 'text-gray-800'
                            }`}>
                                {date.getDate()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            {dayEvents.map((event, index) => (
                                <div key={index} className="text-center">
                                    {event.type === 'water' && (
                                        <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
                                    )}
                                    {event.type === 'measure' && (
                                        <FontAwesomeIcon icon={faRuler} className="text-yellow-500" />
                                    )}
                                    {event.type === 'plant' && (
                                        <FontAwesomeIcon icon={faSeedling} className="text-green-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MonthlyView = ({ currentDate, events }) => {
    // Get the first day of the displayed month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfMonth = firstDay.getDay();
    
    // Get the last day of the displayed month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Create array of date objects for the calendar grid
    const calendarDays = [];
    
    // Add previous month's days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const prevMonthDays = firstDayOfMonth;
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const date = new Date(prevMonthLastDay);
        date.setDate(prevMonthLastDay.getDate() - i);
        calendarDays.push({ date, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        calendarDays.push({ date, isCurrentMonth: true });
    }
    
    // Add next month's days
    const remainingDays = 42 - calendarDays.length; // 42 = 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
        calendarDays.push({ date, isCurrentMonth: false });
    }

    return (
        <div>
            {/* Month and Year Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
            </div>
            
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(({ date, isCurrentMonth }, index) => {
                    const dateKey = formatDateKey(date);
                    const isToday = formatDateKey(new Date()) === dateKey;
                    const dayEvents = events[dateKey] || [];

                    return (
                        <div
                            key={index}
                            className={`p-2 min-h-[80px] ${
                                isToday 
                                    ? 'bg-green-100 rounded-lg border-2 border-green-500' 
                                    : isCurrentMonth
                                        ? 'hover:bg-gray-50'
                                        : 'bg-gray-50 text-gray-400'
                            }`}
                        >
                            <p className={`text-sm mb-1 ${
                                isToday ? 'text-green-600 font-bold' : ''
                            }`}>
                                {date.getDate()}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {dayEvents.map((event, i) => (
                                    <div 
                                        key={i} 
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
                                                    opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
        </div>
    );
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('monthly');
    const [slideDirection, setSlideDirection] = useState('left');
    const [events, setEvents] = useState({});
    const { user } = useAuth()

    // Fetch and process events
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

    const handleViewChange = (newView) => {
        setSlideDirection(newView === 'weekly' ? 'right' : 'left');
        setView(newView);
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + direction);
            return newDate;
        });
    };

    const navigateWeek = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + (direction * 7));
            return newDate;
        });
    };

    return (
        <ProtectedRoute>
            <div className="p-8 max-w-7xl mx-auto">
                {/* <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-4">Tree Calendar</h1>
                    <div className="flex justify-center gap-4 bg-white p-2 rounded-lg shadow-sm">
                        <button
                            onClick={() => handleViewChange('weekly')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                view === 'weekly'
                                    ? 'bg-green-100 text-green-700'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCalendarWeek} />
                            Weekly
                        </button>
                        <button
                            onClick={() => handleViewChange('monthly')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                view === 'monthly'
                                    ? 'bg-green-100 text-green-700'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCalendarDays} />
                            Monthly
                        </button>
                    </div>
                </div> */}

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-4 mt-4 mb-6">
                    <button
                        onClick={() => view === 'weekly' ? navigateWeek(-1) : navigateMonth(-1)}
                        className="px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                        Previous {view === 'weekly' ? 'Week' : 'Month'}
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => view === 'weekly' ? navigateWeek(1) : navigateMonth(1)}
                        className="px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                        Next {view === 'weekly' ? 'Week' : 'Month'}
                    </button>
                </div>

                {/* Calendar View */}
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ x: slideDirection === 'left' ? 300 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: slideDirection === 'left' ? -300 : 300, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="bg-white p-6 rounded-xl shadow-lg"
                        >
                            <MonthlyView currentDate={currentDate} events={events} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
                            <span className="text-sm text-gray-600">Watered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faRuler} className="text-yellow-500" />
                            <span className="text-sm text-gray-600">Logged</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faSeedling} className="text-green-500" />
                            <span className="text-sm text-gray-600">Planted</span>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Calendar;