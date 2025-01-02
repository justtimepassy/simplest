import React, { useState } from "react";

const AttendanceCalculator = () => {
  const [workingDays, setWorkingDays] = useState("");
  const [holidaysTaken, setHolidaysTaken] = useState("");
  const [extraHolidays, setExtraHolidays] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const calculateAttendance = () => {
    const totalWorkingDays = parseInt(workingDays);
    const holidays = parseInt(holidaysTaken);
    const extraHols = parseInt(extraHolidays);
    const semesterStart = new Date(semesterStartDate);
    const today = new Date();

    const nationalHolidays = [
      "2025-01-01",
      "2025-01-26",
      "2025-04-14",
      "2025-05-01",
      "2025-08-15",
      "2025-10-02",
      "2025-11-14",
      "2025-12-25",
    ];

    if (isNaN(totalWorkingDays) || isNaN(holidays) || isNaN(extraHols) || !semesterStartDate) {
      alert("Please fill in all required fields!");
      return;
    }

    let currentDate = new Date(semesterStart);
    let workingDaysTillToday = 0;

    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = currentDate.toISOString().split("T")[0];

      // Exclude Sundays and national holidays
      if (dayOfWeek !== 0 && !nationalHolidays.includes(formattedDate)) {
        workingDaysTillToday++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    workingDaysTillToday -= extraHols;
    const attendedDays = workingDaysTillToday - holidays;

    // Negative attendance check
    if (attendedDays < 0) {
      setResult({
        attendancePercentage: null,
        projectedPercentage: null,
        message: "Kathal Oddhu",
      });
      setShowModal(true);
      return;
    }

    const attendancePercentage = (attendedDays / workingDaysTillToday) * 100;
    const remainingWorkingDays = totalWorkingDays - workingDaysTillToday;
    const totalAttendedIfPerfect = attendedDays + remainingWorkingDays;
    const projectedPercentage = (totalAttendedIfPerfect / totalWorkingDays) * 100;
    const adjustedProjectedPercentage = Math.max(projectedPercentage, attendancePercentage);

    let message = "";
    if (workingDaysTillToday >= totalWorkingDays) {
      message = `Semester is over! Attendance percentage till today: ${attendancePercentage.toFixed(2)}%`;
      setResult({
        attendancePercentage: attendancePercentage.toFixed(2),
        projectedPercentage: null,
        message: message,
      });
    } else {
      if (adjustedProjectedPercentage === 75) {
        message = "oaka day miss aina condonation eh";
      } else if (attendancePercentage < 75 && adjustedProjectedPercentage > 75) {
        message = "Vellaka Pothe Kudusthav";
      } else if (adjustedProjectedPercentage < 75) {
        message = "Condonation ready chesko";
      }
      setResult({
        attendancePercentage: attendancePercentage.toFixed(2),
        projectedPercentage: adjustedProjectedPercentage.toFixed(2),
        message: message,
      });
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Attendance Calculator
            </h3>
          </div>
          {/* Card Content */}
          <div className="p-6 pt-2 space-y-4">
            {/* Input Groups */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Total Working Days in Semester
                </label>
                <input
                  type="number"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter total working days"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Number of Holidays Taken
                </label>
                <input
                  type="number"
                  value={holidaysTaken}
                  onChange={(e) => setHolidaysTaken(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter holidays taken"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Number of Extra Public Holidays
                </label>
                <input
                  type="number"
                  value={extraHolidays}
                  onChange={(e) => setExtraHolidays(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter extra holidays"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Semester Start Date
                </label>
                <input
                  type="date"
                  value={semesterStartDate}
                  onChange={(e) => setSemesterStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <button
              onClick={calculateAttendance}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-10 px-4 py-2 w-full"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Attendance Results
              </h2>
            </div>
            {result && (
              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="text-sm font-medium text-zinc-900">
                    {result.attendancePercentage !== null && `Current Attendance: ${result.attendancePercentage}%`}
                  </p>
                  {result.projectedPercentage && (
                    <p className="text-sm font-medium text-zinc-900 mt-2">
                      Projected Attendance: {result.projectedPercentage}%
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="text-sm text-zinc-900">
                    {result.message}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 h-10 px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalculator;
