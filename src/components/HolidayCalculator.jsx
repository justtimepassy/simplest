import React, { useState } from "react";

const HolidayCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState("");
  const [holidaysUsed, setHolidaysUsed] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vacations, setVacations] = useState([{ startDate: "", endDate: "" }]); // State for vacations

  const nationalHolidays = [
    "2025-01-01", "2025-01-26", "2025-04-14", "2025-05-01",
    "2025-08-15", "2025-10-02", "2025-11-14", "2025-12-25",
  ];

  // Function to handle vacation input changes
  const handleVacationChange = (index, e) => {
    const updatedVacations = [...vacations];
    updatedVacations[index][e.target.name] = e.target.value;
    setVacations(updatedVacations);
  };

  // Function to add a new vacation period
  const addVacation = () => {
    setVacations([...vacations, { startDate: "", endDate: "" }]);
  };

  // Function to remove a vacation period
  const removeVacation = (index) => {
    const updatedVacations = vacations.filter((_, i) => i !== index);
    setVacations(updatedVacations);
  };

  // Function to check if a date falls within any vacation period
  const isDateInVacation = (date) => {
    return vacations.some((vacation) => {
      if (vacation.startDate && vacation.endDate) {
        const vacationStart = new Date(vacation.startDate);
        const vacationEnd = new Date(vacation.endDate);
        return date >= vacationStart && date <= vacationEnd;
      }
      return false;
    });
  };

  const calculateHolidaysUsed = () => {
    if (!startDate || !endDate || !attendancePercentage) {
      alert("Please fill in all fields!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const percentage = parseFloat(attendancePercentage);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert("Please enter a valid attendance percentage (0-100)!");
      return;
    }

    let workingDays = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = currentDate.toISOString().split("T")[0];

      // Check if the date is a working day (not Sunday, not a national holiday, and not in a vacation period)
      if (
        dayOfWeek !== 0 &&
        !nationalHolidays.includes(formattedDate) &&
        !isDateInVacation(currentDate)
      ) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const attendedDays = (workingDays * percentage) / 100;
    const holidays = workingDays - attendedDays;
    setHolidaysUsed(Math.round(holidays));
    setShowModal(true); // Show the modal after calculation
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Holiday Calculator
            </h3>
          </div>
          <div className="p-6 pt-2 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Attendance Percentage</label>
                <input
                  type="number"
                  value={attendancePercentage}
                  onChange={(e) => setAttendancePercentage(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  placeholder="Enter attendance percentage (e.g., 75)"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium leading-none">
                  Vacations
                </label>
                {vacations.map((vacation, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="date"
                      name="startDate"
                      value={vacation.startDate}
                      onChange={(e) => handleVacationChange(index, e)}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={vacation.endDate}
                      onChange={(e) => handleVacationChange(index, e)}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    />
                    <button
                      onClick={() => removeVacation(index)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  onClick={addVacation}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                >
                  Add Vacation
                </button>
              </div>

              <button
                onClick={calculateHolidaysUsed}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 shadow-sm transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                Calculate Holidays Used
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowModal(false)} 
          />
          <div className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Holiday Calculation Results
              </h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                <p className="text-sm font-medium text-zinc-900">
                  Total Working Days:{" "}
                  <span className="font-medium">
                    {holidaysUsed !== null
                      ? Math.round(holidaysUsed / (1 - attendancePercentage / 100))
                      : "N/A"}
                  </span>
                </p>
                <p className="text-sm font-medium text-zinc-900 mt-2">
                  Holidays Used: <span className="font-medium">{holidaysUsed}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalculator;