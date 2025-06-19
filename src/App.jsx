import { useState, useEffect } from 'react'

// firestore 
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase.js';


import './App.css'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";

// Components
import Home from './pages/home/home.jsx';
import Auth from './pages/auth/index.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Landing from './pages/landing/landing.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { TabProvider } from './context/TabContext';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {

	const [data, setData] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Example: Fetch documents from a collection called 'yourCollection'
				const querySnapshot = await getDocs(collection(db, "yourCollection"));
				const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setData(items);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []); 

	return (
		<>
			<Router>
				{/* <AuthProvider> */}
					<TabProvider>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route path="/auth" element={<Auth />} />
							<Route 
								path="/admin" 
								element={
									<ProtectedRoute>
										<AdminDashboard />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/home/*" 
								element={
									<ProtectedRoute>
										<Home />
									</ProtectedRoute>
								} 
							/>
						</Routes>
					</TabProvider>
				{/* </AuthProvider> */}
			</Router>

		</>
	)
}

export default App
