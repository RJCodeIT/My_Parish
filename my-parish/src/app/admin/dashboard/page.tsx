'use client';

import { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import StatisticsCard from "@/components/ui/StatisticsCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

type Statistics = {
  currentYear: number;
  previousYear: number;
  groups: {
    totalCount: number;
    membersCount: number;
  };
  parishioners: {
    totalCount: number;
    previousYearCount: number;
    growth: number;
  };
  sacraments: {
    baptisms: {
      currentYear: number;
      previousYear: number;
      change: number;
    };
    funerals: {
      currentYear: number;
      previousYear: number;
      change: number;
    };
    weddings: {
      currentYear: number;
      previousYear: number;
      change: number;
    };
    communions: {
      currentYear: number;
      previousYear: number;
      change: number;
    };
  };
};

export default function AdminDashboard() {
  const currentSystemYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentSystemYear);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zakres dostępnych lat (od 5 lat wstecz do bieżącego roku)
  const availableYears = Array.from(
    { length: 6 }, // 5 lat wstecz + rok bieżący
    (_, i) => currentSystemYear - 5 + i
  );

  const fetchStatistics = async (year: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/statistics?year=${year}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać statystyk');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania statystyk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obsługa zmiany roku wstecz
  const handlePreviousYear = () => {
    const prevYear = Math.max(selectedYear - 1, currentSystemYear - 5);
    setSelectedYear(prevYear);
    fetchStatistics(prevYear);
  };

  // Obsługa zmiany roku w przód
  const handleNextYear = () => {
    const nextYear = Math.min(selectedYear + 1, currentSystemYear);
    setSelectedYear(nextYear);
    fetchStatistics(nextYear);
  };

  // Obsługa wyboru roku z selekta
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    fetchStatistics(year);
  };

  useEffect(() => {
    fetchStatistics(selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <SectionTitle name="Statystyki parafii" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <SectionTitle name="Statystyki parafii" />
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <p>Odśwież stronę lub spróbuj ponownie później.</p>
        </div>
      </div>
    );
  }

  // Render dashboard with statistics
  return (
    <div className="p-6 space-y-6">
      <SectionTitle name="Statystyki parafii" />
      
      {/* Year selector */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button 
          onClick={handlePreviousYear}
          disabled={selectedYear <= currentSystemYear - 5}
          className={`flex items-center justify-center p-2 rounded-full ${selectedYear <= currentSystemYear - 5 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10 transition-colors'}`}
          aria-label="Poprzedni rok"
        >
          <FaAngleLeft size={24} />
        </button>
        
        <div className="relative">
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            className="text-xl font-semibold bg-transparent border-b border-primary text-primary appearance-none pl-2 pr-8 py-1 cursor-pointer focus:outline-none"
            aria-label="Wybierz rok"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <button 
          onClick={handleNextYear}
          disabled={selectedYear >= currentSystemYear}
          className={`flex items-center justify-center p-2 rounded-full ${selectedYear >= currentSystemYear ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10 transition-colors'}`}
          aria-label="Następny rok"
        >
          <FaAngleRight size={24} />
        </button>
      </div>
      
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Groups Statistics - Custom Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transform transition duration-300 hover:shadow-lg">
            <div className="relative bg-blue-700 p-4 text-white">
              <div className="flex items-center">
                <div className="mr-3 text-white bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.296 5.672c0.528 0 0.957-0.428 0.957-0.956 0-0.53-0.429-0.958-0.957-0.958-0.531 0-0.959 0.428-0.959 0.958 0 0.527 0.428 0.956 0.959 0.956zM7.722 5.672c0.528 0 0.957-0.428 0.957-0.956 0-0.53-0.428-0.958-0.957-0.958-0.53 0-0.959 0.428-0.959 0.958 0 0.527 0.428 0.956 0.959 0.956zM16.87 5.672c0.528 0 0.957-0.428 0.957-0.956 0-0.53-0.428-0.958-0.957-0.958-0.53 0-0.959 0.428-0.959 0.958 0 0.527 0.428 0.956 0.959 0.956zM12.296 10.007c1.059 0 1.915-0.857 1.915-1.914 0-1.057-0.856-1.913-1.915-1.913-1.059 0-1.915 0.857-1.915 1.913 0 1.057 0.856 1.914 1.915 1.914zM7.722 10.007c1.059 0 1.915-0.857 1.915-1.914 0-1.057-0.856-1.913-1.915-1.913-1.059 0-1.915 0.857-1.915 1.913 0 1.057 0.856 1.914 1.915 1.914zM16.87 10.007c1.059 0 1.915-0.857 1.915-1.914 0-1.057-0.856-1.913-1.915-1.913-1.059 0-1.915 0.857-1.915 1.913 0 1.057 0.856 1.914 1.915 1.914zM7.722 14.353c1.589 0 2.874-1.286 2.874-2.871 0-1.587-1.285-2.873-2.874-2.873-1.588 0-2.872 1.286-2.872 2.873 0 1.585 1.284 2.871 2.872 2.871zM16.87 14.353c1.589 0 2.874-1.286 2.874-2.871 0-1.587-1.285-2.873-2.874-2.873-1.588 0-2.872 1.286-2.872 2.873 0 1.585 1.284 2.871 2.872 2.871zM12.296 16.281c-4.014 0-7.295 3.281-7.295 7.294h14.59c0-4.013-3.281-7.294-7.295-7.294zM7.722 16.281c-4.233 0-7.722 3.489-7.722 7.719h5.831c0-1.034 0.196-2.019 0.549-2.929-1.285-0.74-2.197-1.88-2.451-3.168 1.139-0.921 2.588-1.474 4.166-1.474 0.010 0 0.018 0.002 0.028 0.002 0.240-0.072 0.516-0.112 0.821-0.125-0.224 0.235-0.424 0.494-0.62 0.75-0.196 0.256-0.345 0.538-0.513 0.811-0.167 0.272-0.351 0.52-0.482 0.812-0.021 0.047-0.045 0.093-0.065 0.14-0.137 0.308-0.217 0.638-0.3 0.967-0.082 0.329-0.164 0.659-0.2 1-0.036 0.341-0.018 0.689-0.027 1.033-0.006 0.259-0.069 0.505-0.015 0.759h-2.256c0.094-2.298 1.044-4.372 2.522-5.882-0.32-0.404-0.574-0.847-0.746-1.318-0.177-0.073-0.358-0.138-0.52-0.23M16.87 16.281c-0.037 0-0.072 0.005-0.109 0.005 0.268 0.246 0.514 0.511 0.736 0.796 0.609 0.781 1.067 1.706 1.33 2.603 0.264 0.897 0.324 1.791 0.262 2.662-0.031 0.437-0.009 0.883-0.123 1.312-0.033 0.124-0.066 0.248-0.115 0.34h1.979c-0.267-4.001-3.607-7.719-7.698-7.719 0.001 0 0.001 0 0.002 0 0.139 0.033 0.262 0.004 0.344 0.1 0.212 0.015 0.424 0.030 0.634 0.059 0.419 0.056 0.83 0.134 1.231 0.254 0.4 0.12 0.791 0.27 1.167 0.451 0.187 0.09 0.371 0.185 0.549 0.291 0.089 0.053 0.179 0.105 0.267 0.163-0.114-0.039-0.243-0.033-0.359-0.059-0.229-0.052-0.445-0.124-0.637-0.227-0.383-0.203-0.526-0.484-0.675-0.774 0.407 0.176 0.82 0.338 1.238 0.49 0.418 0.151 0.84 0.287 1.266 0.406 0.425 0.119 0.851 0.223 1.283 0.3 0.215 0.038 0.432 0.070 0.65 0.093-0.195 0.212-0.415 0.405-0.643 0.598-0.229 0.193-0.463 0.379-0.704 0.559-0.242 0.179-0.49 0.353-0.749 0.508-0.258 0.154-0.52 0.295-0.787 0.433-0.132 0.069-0.267 0.134-0.402 0.199 0.135-0.086 0.272-0.17 0.422-0.232 0.149-0.063 0.311-0.103 0.47-0.152 0.319-0.097 0.645-0.18 0.967-0.273 0.321-0.093 0.642-0.191 0.951-0.31 0.309-0.119 0.613-0.25 0.896-0.411 0.282-0.162 0.551-0.345 0.786-0.561 0.235-0.216 0.44-0.458 0.612-0.719 0.172-0.262 0.313-0.54 0.429-0.83 0.059-0.145 0.111-0.294 0.155-0.444z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Grupy parafialne</h2>
              </div>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
            <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-medium">Liczba grup:</div>
                <div className="text-2xl font-bold text-primary">{statistics.groups.totalCount}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-medium">Liczba członków:</div>
                <div className="text-2xl font-bold text-primary">{statistics.groups.membersCount}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-medium">Średnio osób w grupie:</div>
                <div className="text-xl font-medium text-primary">
                  {statistics.groups.totalCount > 0 
                    ? (statistics.groups.membersCount / statistics.groups.totalCount).toFixed(1) 
                    : 0}
                </div>
              </div>
            </div>
          </div>

          {/* Parishioners Statistics */}
          <StatisticsCard 
            title="Parafianie"
            bgColorClass="bg-green-700"
            currentYear={statistics.currentYear}
            previousYear={statistics.previousYear}
            currentValue={statistics.parishioners.totalCount}
            previousValue={statistics.parishioners.previousYearCount}
            change={statistics.parishioners.growth}
            iconName="users"
          />

          {/* Baptisms Statistics */}
          <StatisticsCard 
            title="Chrzty"
            bgColorClass="bg-indigo-700"
            currentYear={statistics.currentYear}
            previousYear={statistics.previousYear}
            currentValue={statistics.sacraments.baptisms.currentYear}
            previousValue={statistics.sacraments.baptisms.previousYear}
            change={statistics.sacraments.baptisms.change}
            iconName="pray"
          />

          {/* Funerals Statistics */}
          <StatisticsCard 
            title="Pogrzeby"
            bgColorClass="bg-stone-700"
            currentYear={statistics.currentYear}
            previousYear={statistics.previousYear}
            currentValue={statistics.sacraments.funerals.currentYear}
            previousValue={statistics.sacraments.funerals.previousYear}
            change={statistics.sacraments.funerals.change}
            inverse={true} 
            iconName="cross"
          />

          {/* Weddings Statistics */}
          <StatisticsCard 
            title="Śluby"
            bgColorClass="bg-rose-700"
            currentYear={statistics.currentYear}
            previousYear={statistics.previousYear}
            currentValue={statistics.sacraments.weddings.currentYear}
            previousValue={statistics.sacraments.weddings.previousYear}
            change={statistics.sacraments.weddings.change}
            iconName="hands"
          />

          {/* Communions Statistics */}
          <StatisticsCard 
            title="Pierwsze Komunie"
            bgColorClass="bg-amber-600"
            currentYear={statistics.currentYear}
            previousYear={statistics.previousYear}
            currentValue={statistics.sacraments.communions.currentYear}
            previousValue={statistics.sacraments.communions.previousYear}
            change={statistics.sacraments.communions.change}
            iconName="book"
          />
        </div>
      )}
    </div>
  );
}