import React, { useState } from "react";

const AttendanceCalculator = () => {
  const [workingDays, setWorkingDays] = useState("");
  const [holidaysTaken, setHolidaysTaken] = useState("");
  const [extraHolidays, setExtraHolidays] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [vacations, setVacations] = useState([{ startDate: "", endDate: "" }]);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetAttendance, setTargetAttendance] = useState(""); // New state for target attendance

  const handleVacationChange = (index, e) => {
    const updatedVacations = [...vacations];
    updatedVacations[index][e.target.name] = e.target.value;
    setVacations(updatedVacations);
  };

  const addVacation = () => {
    setVacations([...vacations, { startDate: "", endDate: "" }]);
  };

  const removeVacation = (index) => {
    const updatedVacations = vacations.filter((_, i) => i !== index);
    setVacations(updatedVacations);
  };

  const isDateInVacation = (date) => {
    return vacations.some(vacation => {
      if (vacation.startDate && vacation.endDate) {
        const vacationStart = new Date(vacation.startDate);
        const vacationEnd = new Date(vacation.endDate);
        return date >= vacationStart && date <= vacationEnd;
      }
      return false;
    });
  };

  const calculateAttendance = () => {
    const totalWorkingDays = parseInt(workingDays);
    const holidays = parseInt(holidaysTaken);
    const extraHols = parseInt(extraHolidays);
    const semesterStart = new Date(semesterStartDate);
    const today = new Date();

    const nationalHolidays = [
      "2025-01-01", "2025-01-26", "2025-04-14", "2025-05-01",
      "2025-08-15", "2025-10-02", "2025-11-14", "2025-12-25",
    ];

    if (isNaN(totalWorkingDays) || isNaN(holidays) || isNaN(extraHols) || !semesterStartDate) {
      alert("Please fill in all required fields!");
      return;
    }

    let workingDaysTillToday = 0;
    let currentDate = new Date(semesterStart);

    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = currentDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && 
          !nationalHolidays.includes(formattedDate) && 
          !isDateInVacation(currentDate)) {
        workingDaysTillToday++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    workingDaysTillToday -= extraHols;
    const attendedDays = workingDaysTillToday - holidays;

    if (attendedDays < 0) {
      setResult({
        attendancePercentage: null,
        projectedPercentage: null,
        message: "Kathal Oddhu",
        daysToTarget: null, // No days to target if attendance is negative
      });
      setShowModal(true);
      return;
    }

    const attendancePercentage = (attendedDays / workingDaysTillToday) * 100;
    const remainingWorkingDays = totalWorkingDays - workingDaysTillToday;
    const totalAttendedIfPerfect = attendedDays + remainingWorkingDays;
    const projectedPercentage = (totalAttendedIfPerfect / totalWorkingDays) * 100;
    const adjustedProjectedPercentage = Math.max(projectedPercentage, attendancePercentage);

    // Calculate days to reach target attendance
    let daysToTarget = null;
    let targetMessage = "";
    if (targetAttendance && !isNaN(targetAttendance)) {
      const target = parseFloat(targetAttendance);
      if (target > projectedPercentage) {
        targetMessage = "Target Attendance : Adhi avvadhu amma";
      } else if (attendancePercentage >= target) {
        targetMessage = "Target Attendance : Already Undhi ga";
      } else if (target === projectedPercentage) {
        targetMessage = "Neeku holidays levu inka";
      } else {
        daysToTarget = Math.ceil(
          (target * workingDaysTillToday - 100 * attendedDays) / (100 - target)
        );
      }
    }

    let message = "";
    if (workingDaysTillToday >= totalWorkingDays) {
      message = `Semester is over! Attendance percentage till today: ${attendancePercentage.toFixed(2)}%`;
      setResult({
        attendancePercentage: attendancePercentage.toFixed(2),
        projectedPercentage: null,
        message,
        daysToTarget,
        targetMessage,
      });
    } else {
      if (adjustedProjectedPercentage === 75) {
        message = "oaka day miss aina condonation eh";
      } else if (attendancePercentage < 75 && adjustedProjectedPercentage > 75) {
        message = "Vellaka Pothe Kudusthav";
      } else if (adjustedProjectedPercentage < 75) {
        message = "Condonation ready chesko";
      } else if(attendancePercentage >= 90){
        message = "Award em ledhu dheeniki, Panikoche panulu chudu";
      }
      else if(attendancePercentage > 75 && attendancePercentage < 90){
        message = "Chaalu intha unte";
      }
      setResult({
        attendancePercentage: attendancePercentage.toFixed(2),
        projectedPercentage: adjustedProjectedPercentage.toFixed(2),
        message,
        daysToTarget,
        targetMessage,
      });
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Attendance Calculator
            </h3>
          </div>
          <div className="p-6 pt-2 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Total Working Days in Semester
                </label>
                <input
                  type="number"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  placeholder="Enter total working days"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Number of Holidays Taken
                </label>
                <input
                  type="number"
                  value={holidaysTaken}
                  onChange={(e) => setHolidaysTaken(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  placeholder="Enter holidays taken"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Extra Public Holidays
                </label>
                <input
                  type="number"
                  value={extraHolidays}
                  onChange={(e) => setExtraHolidays(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  placeholder="Enter extra holidays"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Semester Start Date
                </label>
                <input
                  type="date"
                  value={semesterStartDate}
                  onChange={(e) => setSemesterStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Target Attendance Percentage
                </label>
                <input
                  type="number"
                  value={targetAttendance}
                  onChange={(e) => setTargetAttendance(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  placeholder="Enter target attendance (e.g., 75)"
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
            </div>

            <button
              onClick={calculateAttendance}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 shadow-sm transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Calculate
            </button>
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
                Attendance Results
              </h2>
            </div>
            {result && (
              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="text-sm font-medium text-zinc-900">
                    {result.attendancePercentage !== null && 
                      `Current Attendance: ${result.attendancePercentage}%`}
                  </p>
                  {result.projectedPercentage && (
                    <p className="text-sm font-medium text-zinc-900 mt-2">
                      Projected Attendance: {result.projectedPercentage}%
                    </p>
                  )}
                  {result.daysToTarget !== null && (
                    <p className="text-sm font-medium text-zinc-900 mt-2">
                      Days to reach {targetAttendance}%: {result.daysToTarget}
                    </p>
                  )}
                  {result.targetMessage && (
                    <p className="text-sm font-medium text-zinc-900 mt-2">
                      {result.targetMessage}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="text-sm text-zinc-900">{result.message}</p>
                </div>
              </div>
            )}
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

export default AttendanceCalculator;