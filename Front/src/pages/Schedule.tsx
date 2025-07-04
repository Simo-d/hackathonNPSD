import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  User, 
  Filter,
  Download,
  Printer,
  Share2,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  room: string;
  color: string;
  type: 'COURSE' | 'TD' | 'TP' | 'EXAM';
}

interface TimeSlot {
  time: string;
  courses: { [key: string]: Course | null }; // day -> course
}

export const Schedule: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');

  // 7 subjects with different colors
  const subjects: Course[] = [
    {
      id: '1',
      name: 'Intelligence Artificielle',
      code: 'IA101',
      professor: 'Dr. Benali',
      room: 'Amphi A',
      color: 'bg-blue-500',
      type: 'COURSE'
    },
    {
      id: '2',
      name: 'Algorithmique Avancée',
      code: 'ALG201',
      professor: 'Prof. Idrissi',
      room: 'Salle 203',
      color: 'bg-purple-500',
      type: 'COURSE'
    },
    {
      id: '3',
      name: 'Base de Données',
      code: 'BD301',
      professor: 'Dr. Alaoui',
      room: 'Lab Info 1',
      color: 'bg-green-500',
      type: 'TP'
    },
    {
      id: '4',
      name: 'Réseaux Informatiques',
      code: 'RES401',
      professor: 'Prof. Benjelloun',
      room: 'Salle 105',
      color: 'bg-orange-500',
      type: 'TD'
    },
    {
      id: '5',
      name: 'Génie Logiciel',
      code: 'GL501',
      professor: 'Dr. Chakir',
      room: 'Amphi B',
      color: 'bg-red-500',
      type: 'COURSE'
    },
    {
      id: '6',
      name: 'Sécurité Informatique',
      code: 'SEC601',
      professor: 'Prof. Tazi',
      room: 'Lab Sécu',
      color: 'bg-indigo-500',
      type: 'TP'
    },
    {
      id: '7',
      name: 'Mathématiques Appliquées',
      code: 'MATH701',
      professor: 'Dr. Fassi',
      room: 'Salle 301',
      color: 'bg-pink-500',
      type: 'COURSE'
    }
  ];

  // Professional weekly schedule
  const weeklySchedule: TimeSlot[] = [
    {
      time: '08:00 - 09:30',
      courses: {
        'Lundi': subjects[0], // IA
        'Mardi': subjects[3], // Réseaux
        'Mercredi': subjects[6], // Math
        'Jeudi': subjects[1], // Algo
        'Vendredi': subjects[4], // GL
        'Samedi': null,
        'Dimanche': null
      }
    },
    {
      time: '09:45 - 11:15',
      courses: {
        'Lundi': subjects[1], // Algo
        'Mardi': subjects[2], // BD (TP)
        'Mercredi': subjects[0], // IA
        'Jeudi': subjects[5], // Sécurité (TP)
        'Vendredi': subjects[3], // Réseaux
        'Samedi': subjects[6], // Math
        'Dimanche': null
      }
    },
    {
      time: '11:30 - 13:00',
      courses: {
        'Lundi': subjects[2], // BD
        'Mardi': subjects[4], // GL
        'Mercredi': subjects[3], // Réseaux (TD)
        'Jeudi': subjects[0], // IA
        'Vendredi': subjects[5], // Sécurité
        'Samedi': subjects[1], // Algo
        'Dimanche': null
      }
    },
    {
      time: '14:00 - 15:30',
      courses: {
        'Lundi': subjects[5], // Sécurité
        'Mardi': subjects[6], // Math
        'Mercredi': subjects[4], // GL
        'Jeudi': subjects[2], // BD (TP)
        'Vendredi': subjects[0], // IA
        'Samedi': null,
        'Dimanche': null
      }
    },
    {
      time: '15:45 - 17:15',
      courses: {
        'Lundi': subjects[4], // GL
        'Mardi': subjects[1], // Algo
        'Mercredi': subjects[2], // BD
        'Jeudi': subjects[6], // Math
        'Vendredi': subjects[3], // Réseaux (TD)
        'Samedi': null,
        'Dimanche': null
      }
    },
    {
      time: '17:30 - 19:00',
      courses: {
        'Lundi': null,
        'Mardi': subjects[5], // Sécurité (TP)
        'Mercredi': null,
        'Jeudi': subjects[4], // GL
        'Vendredi': null,
        'Samedi': null,
        'Dimanche': null
      }
    }
  ];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'COURSE': return 'Cours';
      case 'TD': return 'TD';
      case 'TP': return 'TP';
      case 'EXAM': return 'Examen';
      default: return 'Cours';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'COURSE': return 'bg-blue-100 text-blue-800';
      case 'TD': return 'bg-green-100 text-green-800';
      case 'TP': return 'bg-orange-100 text-orange-800';
      case 'EXAM': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates();

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`${course.color} text-white p-3 rounded-lg shadow-sm cursor-pointer transition-all duration-200 h-full`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm leading-tight">{course.name}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(course.type)} bg-white/20`}>
            {getTypeLabel(course.type)}
          </span>
        </div>
        <p className="text-xs opacity-90 mb-1">{course.code}</p>
        <div className="mt-auto space-y-1">
          <div className="flex items-center text-xs opacity-90">
            <User className="w-3 h-3 mr-1" />
            <span className="truncate">{course.professor}</span>
          </div>
          <div className="flex items-center text-xs opacity-90">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{course.room}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Calendar className="w-10 h-10 mr-4" />
              Emploi du Temps
            </h1>
            <p className="text-blue-100 text-lg">
              Semaine du {weekDates[0].toLocaleDateString('fr-FR')} au {weekDates[6].toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const prevWeek = new Date(currentWeek);
                prevWeek.setDate(prevWeek.getDate() - 7);
                setCurrentWeek(prevWeek);
              }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">
                {currentWeek.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-sm text-gray-600">
                Semaine {Math.ceil((currentWeek.getDate() - currentWeek.getDay() + 1) / 7)}
              </p>
            </div>
            <button
              onClick={() => {
                const nextWeek = new Date(currentWeek);
                nextWeek.setDate(nextWeek.getDate() + 7);
                setCurrentWeek(nextWeek);
              }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Professional Weekly Timetable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Header */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-32 p-4 text-left font-bold text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Horaires
                  </div>
                </th>
                {days.map((day, index) => (
                  <th key={day} className="p-4 text-center font-bold text-gray-900 min-w-[180px]">
                    <div className="space-y-1">
                      <div className="text-sm font-bold">{day}</div>
                      <div className="text-xs text-gray-600 font-normal">
                        {weekDates[index].toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {weeklySchedule.map((slot, slotIndex) => (
                <tr key={slotIndex} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  {/* Time Column */}
                  <td className="p-4 bg-gray-50/50 border-r border-gray-200">
                    <div className="text-sm font-bold text-gray-900">{slot.time}</div>
                  </td>
                  
                  {/* Course Columns */}
                  {days.map((day) => (
                    <td key={`${slotIndex}-${day}`} className="p-2 align-top">
                      <div className="h-24">
                        {slot.courses[day] ? (
                          <CourseCard course={slot.courses[day]!} />
                        ) : (
                          <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
                            <Plus className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Subjects Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Matières de cette semaine
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <div className={`w-4 h-4 ${subject.color} rounded-full mr-3`}></div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{subject.name}</h4>
                  <p className="text-xs text-gray-600">{subject.code}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(subject.type)}`}>
                  {getTypeLabel(subject.type)}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-2" />
                  <span>{subject.professor}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-2" />
                  <span>{subject.room}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-blue-100 text-sm">Matières</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-green-100 text-sm">Heures/semaine</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">16</p>
              <p className="text-purple-100 text-sm">Créneaux</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-orange-100 text-sm">Jours actifs</p>
            </div>
            <User className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Schedule;
