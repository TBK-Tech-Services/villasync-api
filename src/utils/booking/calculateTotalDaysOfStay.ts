
export function getTotalDaysOfStay(checkIn: Date, checkOut: Date): number {
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    
    const totalDays = Math.ceil(timeDifference / ((1000 * 60 * 60 * 24)));

    return totalDays;
} 