import React from 'react';
import { FaChurch, FaCross, FaPray, FaChartLine, FaUsers, FaBell, FaHands, FaBookReader } from 'react-icons/fa';

type StatisticsCardProps = {
  title: string;
  bgColorClass: string;
  currentYear: number;
  previousYear: number;
  currentValue: number;
  previousValue: number;
  change: number;
  inverse?: boolean;
  suffix?: string;
  showAverage?: boolean;
  denominator?: number;
  iconName?: string;
};

export default function StatisticsCard({
  title,
  bgColorClass,
  currentYear,
  previousYear,
  currentValue,
  previousValue,
  change,
  inverse = false,
  suffix = '',
  showAverage = false,
  denominator = 1,
  iconName = 'church'
}: StatisticsCardProps) {
  // Function to render change indicator with appropriate color
  const renderChangeIndicator = (change: number, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const isNegative = inverse ? change > 0 : change < 0;
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-700' : isNegative ? 'text-red-700' : 'text-gray-500'}`}>
        {change !== 0 ? (
          <>
            {isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {Math.abs(change)}
          </>
        ) : (
          "Bez zmian"
        )}
      </div>
    );
  };

  // Function to render the appropriate icon
  const renderIcon = () => {
    switch(iconName) {
      case 'church':
        return <FaChurch className="text-2xl" />;
      case 'cross':
        return <FaCross className="text-2xl" />;
      case 'pray':
        return <FaPray className="text-2xl" />;
      case 'chart':
        return <FaChartLine className="text-2xl" />;
      case 'users':
        return <FaUsers className="text-2xl" />;
      case 'bell':
        return <FaBell className="text-2xl" />;
      case 'hands':
        return <FaHands className="text-2xl" />;
      case 'book':
        return <FaBookReader className="text-2xl" />;
      default:
        return <FaChurch className="text-2xl" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transform transition duration-300 hover:shadow-lg">
      {/* Header with background gradient and icon */}
      <div className={`relative ${bgColorClass} p-3 sm:p-4 text-white`}>
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 text-white bg-white/20 p-1.5 sm:p-2 rounded-full">
            {renderIcon()}
          </div>
          <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        </div>
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
      
      {/* Card content with softer colors */}
      <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm sm:text-base text-gray-700 font-medium">Rok {currentYear}:</div>
          <div className="text-xl sm:text-2xl font-bold text-primary">{currentValue}{suffix}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm sm:text-base text-gray-700 font-medium">Rok {previousYear}:</div>
          <div className="text-base sm:text-xl text-gray-700">{previousValue}{suffix}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm sm:text-base text-gray-700 font-medium">Zmiana:</div>
          <div className="flex items-center text-base sm:text-xl">
            {renderChangeIndicator(change, inverse)}
          </div>
        </div>
        {showAverage && denominator > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm sm:text-base text-gray-700 font-medium">Średnio:</div>
            <div className="text-base sm:text-xl font-medium text-primary">
              {(currentValue / denominator).toFixed(1)}{suffix}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}