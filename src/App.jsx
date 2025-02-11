import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AttendanceCalculator from "./components/AttendanceCalculator";
import HolidayCalculator from "./components/HolidayCalculator";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/attendance-calculator"
                  className="text-zinc-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Attendance Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/holiday-calculator"
                  className="text-zinc-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Holiday Calculator
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/attendance-calculator" element={<AttendanceCalculator />} />
            <Route path="/holiday-calculator" element={<HolidayCalculator />} />
            <Route path="/" element={<AttendanceCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;