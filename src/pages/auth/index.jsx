import React, { useState } from 'react';
import Login from './login/login';
import Register from './register/register';
import './auth.css';
import { motion, AnimatePresence } from 'framer-motion';
import SessionCheck from './SessionCheck';

const treeVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 }
};

const trunkVariants = {
	initial: { scaleY: 0, originY: 1 },
	animate: { 
		scaleY: 1,
		transition: { duration: 0.8, ease: "easeOut" }
	}
};

const branchVariants = {
	initial: { scale: 0, opacity: 0 },
	animate: (i) => ({
		scale: 1,
		opacity: 1,
		transition: {
		delay: 0.8 + (i * 0.3),
		duration: 0.6,
		ease: "backOut"
		}
	})
};

const leafVariants = {
	initial: { scale: 0, rotate: -45 },
	animate: (i) => ({
		scale: 1,
		rotate: 0,
		transition: {
		delay: 1.5 + (i * 0.1),
		duration: 0.5,
		ease: "backOut"
		}
	})
};

// Seed animation variants
const seedSceneVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 }
};

const seedVariants = {
	initial: { y: -100, rotate: 0 },
	animate: {
		y: 0,
		rotate: 360,
		transition: {
		y: {
			duration: 1.2,
			ease: [0.25, 0.46, 0.45, 0.94]
		},
		rotate: {
			duration: 1.2,
			ease: "easeOut"
		}
		}
	}
};

const soilVariants = {
	initial: { scaleX: 0, originX: 0.5 },
	animate: {
		scaleX: 1,
		transition: {
		delay: 0.3,
		duration: 0.8,
		ease: "easeOut"
		}
	}
};

const rippleVariants = {
	initial: { scale: 0, opacity: 0 },
	animate: {
		scale: [0, 1.5, 2],
		opacity: [0, 0.6, 0],
		transition: {
		delay: 1.2,
		duration: 0.6,
		ease: "easeOut"
		}
	}
};

const rootVariants = {
	initial: { pathLength: 0, opacity: 0 },
	animate: {
		pathLength: 1,
		opacity: 0.7,
		transition: {
		delay: 1.5,
		duration: 0.8,
		ease: "easeOut"
		}
	}
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <SessionCheck />
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Animation/Graphics - Hidden on mobile */}
        <div className="hidden md:flex md:w-3/5 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 items-center justify-center relative overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-32 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="tree"
                variants={treeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <svg className="w-96 h-96 drop-shadow-lg" viewBox="0 0 200 200">
                  {/* Tree trunk */}
                  <motion.rect
                    x="95"
                    y="100"
                    width="10"
                    height="80"
                    fill="url(#trunkGradient)"
                    rx="2"
                    variants={trunkVariants}
                  />
                  
                  {/* Branch layers */}
                  <motion.ellipse
                    cx="100"
                    cy="140"
                    rx="35"
                    ry="25"
                    fill="url(#leafGradient1)"
                    variants={branchVariants}
                    custom={0}
                  />
                  <motion.ellipse
                    cx="100"
                    cy="120"
                    rx="30"
                    ry="20"
                    fill="url(#leafGradient2)"
                    variants={branchVariants}
                    custom={1}
                  />
                  <motion.ellipse
                    cx="100"
                    cy="100"
                    rx="25"
                    ry="18"
                    fill="url(#leafGradient3)"
                    variants={branchVariants}
                    custom={2}
                  />
                  
                  {/* Individual leaves for detail */}
                  {[...Array(8)].map((_, i) => (
                    <motion.ellipse
                      key={i}
                      cx={85 + (i % 4) * 10}
                      cy={95 + Math.floor(i / 4) * 15}
                      rx="3"
                      ry="5"
                      fill="#22c55e"
                      variants={leafVariants}
                      custom={i}
                    />
                  ))}
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#92400e" />
                      <stop offset="100%" stopColor="#a3520e" />
                    </linearGradient>
                    <radialGradient id="leafGradient1" cx="50%" cy="30%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </radialGradient>
                    <radialGradient id="leafGradient2" cx="50%" cy="30%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </radialGradient>
                    <radialGradient id="leafGradient3" cx="50%" cy="30%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </radialGradient>
                  </defs>
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="seed"
                variants={seedSceneVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <svg className="w-96 h-96 drop-shadow-lg" viewBox="0 0 200 200">
                  {/* Soil base */}
                  <motion.path
                    d="M20 160 C40 155 60 150 100 152 C140 154 160 150 180 155 L180 190 L20 190 Z"
                    fill="url(#soilGradient)"
                    variants={soilVariants}
                  />
                  
                  {/* Impact ripple */}
                  <motion.circle
                    cx="100"
                    cy="152"
                    r="15"
                    fill="none"
                    stroke="#8b4513"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    variants={rippleVariants}
                  />
                  
                  {/* Seed */}
                  <motion.g variants={seedVariants}>
                    <ellipse
                      cx="100"
                      cy="145"
                      rx="8"
                      ry="12"
                      fill="url(#seedGradient)"
                      transform="rotate(-15 100 145)"
                    />
                    <ellipse
                      cx="100"
                      cy="145"
                      rx="4"
                      ry="8"
                      fill="#6b4423"
                      transform="rotate(-15 100 145)"
                    />
                  </motion.g>
                  
                  {/* Growing roots */}
                  <motion.g variants={rootVariants}>
                    <motion.path
                      d="M100 155 Q95 165 90 175 Q85 180 80 185"
                      stroke="#8b4513"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M100 155 Q105 165 110 175 Q115 180 120 185"
                      stroke="#8b4513"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M100 155 Q98 168 95 178"
                      stroke="#8b4513"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </motion.g>
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b4513" />
                      <stop offset="50%" stopColor="#a0522d" />
                      <stop offset="100%" stopColor="#6b3410" />
                    </linearGradient>
                    <radialGradient id="seedGradient" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#92400e" />
                    </radialGradient>
                  </defs>
                </svg>
                
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-400 rounded-full"
                      style={{
                        left: `${45 + i * 5}%`,
                        top: `${60 + i * 2}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        delay: 2 + i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side - Auth Forms - Full width on mobile */}
        <div className="w-full md:w-2/5 bg-white flex flex-col items-center min-h-screen md:min-h-0 py-8 px-6 md:p-12">
          {/* Logo or app name - Only visible on mobile */}
          <div className="mb-12">
            <motion.h1 
              className="text-2xl font-bold text-green-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Tree Doctor
            </motion.h1>
          </div>

          {/* Auth container */}
          <div className="w-full max-w-md flex-grow flex flex-col justify-center">
            <div className="flex justify-center mb-8 bg-gray-100 rounded-full p-2">
              <motion.button
                className={`mx-1 px-6 py-2 rounded-full transition-all ${
                  isLogin
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setIsLogin(true)}
                whileHover={{ scale: isLogin ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                className={`mx-1 px-6 py-2 rounded-full transition-all ${
                  !isLogin
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setIsLogin(false)}
                whileHover={{ scale: !isLogin ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register
              </motion.button>
            </div>
            
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? <Login /> : <Register />}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;