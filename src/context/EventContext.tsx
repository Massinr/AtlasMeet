import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNotifications } from './NotificationContext';
import { discordLogger } from '../services/DiscordLogger';
import { useAuth } from './AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  teacherId: string;
  teacherName: string;
  teacherProfilePicture?: string;
  category: string;
  registrationDeadline: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cvContent: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  reviewedAt?: string;
  teacherNotes?: string;
}

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>) => Promise<boolean>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  registerForEvent: (eventId: string, studentId: string, studentName: string, studentEmail: string, cvContent: string) => Promise<boolean>;
  unregisterFromEvent: (eventId: string, studentId: string) => Promise<boolean>;
  approveRegistration: (registrationId: string, teacherNotes?: string) => Promise<boolean>;
  rejectRegistration: (registrationId: string, teacherNotes?: string) => Promise<boolean>;
  getEventById: (id: string) => Event | undefined;
  getRegistrationsByEventId: (eventId: string) => Registration[];
  getPendingRegistrationsByEventId: (eventId: string) => Registration[];
  getApprovedRegistrationsByEventId: (eventId: string) => Registration[];
  getEventsByTeacherId: (teacherId: string) => Event[];
  getRegistrationsByStudentId: (studentId: string) => Registration[];
  searchEvents: (query: string, filters?: { category?: string; location?: string; teacherName?: string }) => Event[];
  updateTeacherProfilePicture: (teacherId: string, profilePicture: string) => void;
  removeTeacherProfilePicture: (teacherId: string) => void;
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

// Sample data for testing
const getSampleEvents = (): Event[] => {
  const teacherId = "sample-teacher-123";
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  
  // Past dates for completed events
  const pastDate1 = new Date();
  pastDate1.setDate(pastDate1.getDate() - 5);
  
  const pastDate2 = new Date();
  pastDate2.setDate(pastDate2.getDate() - 12);
  
  const pastDate3 = new Date();
  pastDate3.setDate(pastDate3.getDate() - 20);
  
  return [
    // Current/Future Events
    {
      id: "sample-event-1",
      title: "Introduction to React Development",
      description: "Learn the fundamentals of React.js, including components, state management, and hooks. Perfect for beginners who want to start their journey in modern web development.",
      date: futureDate.toISOString().split('T')[0],
      time: "14:00",
      location: "Room 301, Computer Science Building",
      capacity: 25,
      registeredCount: 3,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Workshop",
      registrationDeadline: new Date(futureDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sample-event-2",
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into advanced JavaScript topics including closures, promises, async/await, and functional programming patterns.",
      date: new Date(futureDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "10:00",
      location: "https://meet.google.com/abc-defg-hij",
      capacity: 30,
      registeredCount: 1,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Lecture",
      registrationDeadline: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sample-event-3",
      title: "Data Structures and Algorithms",
      description: "Explore fundamental data structures and algorithms. Learn about arrays, linked lists, trees, graphs, and common algorithmic patterns.",
      date: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "16:00",
      location: "Lecture Hall A, Engineering Building",
      capacity: 40,
      registeredCount: 0,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Seminar",
      registrationDeadline: new Date(futureDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    
    // Past/Completed Events
    {
      id: "past-event-1",
      title: "Web Development Bootcamp",
      description: "Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern web development tools. Students built complete projects and learned industry best practices.",
      date: pastDate1.toISOString().split('T')[0],
      time: "09:00",
      location: "Computer Lab B, Technology Center",
      capacity: 30,
      registeredCount: 28,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Bootcamp",
      registrationDeadline: new Date(pastDate1.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "past-event-2",
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, algorithms, and practical applications. Students worked with real datasets and implemented basic ML models.",
      date: pastDate2.toISOString().split('T')[0],
      time: "13:00",
      location: "https://meet.google.com/ml-workshop-2024",
      capacity: 25,
      registeredCount: 22,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Workshop",
      registrationDeadline: new Date(pastDate2.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: true,
      meetingLink: "https://meet.google.com/ml-workshop-2024",
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "past-event-3",
      title: "Database Design and SQL",
      description: "Comprehensive course on database design principles, SQL programming, and database management systems. Students designed and implemented their own databases.",
      date: pastDate3.toISOString().split('T')[0],
      time: "15:00",
      location: "Room 205, Business School",
      capacity: 35,
      registeredCount: 32,
      teacherId: teacherId,
      teacherName: "Dr. Sarah Johnson",
      teacherProfilePicture: "https://example.com/sarah-johnson.jpg",
      category: "Course",
      registrationDeadline: new Date(pastDate3.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      isVirtual: false,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];
};

const getSampleRegistrations = (): Registration[] => {
  return [
    {
      id: "reg-1",
      eventId: "sample-event-1",
      studentId: "student-1",
      studentName: "Alex Chen",
      studentEmail: "alex.chen@student.edu",
      cvContent: "Computer Science student with 2 years of experience in web development. Proficient in JavaScript, React, and Node.js. Completed several projects including a full-stack e-commerce platform.",
      status: "approved",
      registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      teacherNotes: "Strong background in web development. Approved for the workshop."
    },
    {
      id: "reg-2",
      eventId: "sample-event-1",
      studentId: "student-2",
      studentName: "Maria Garcia",
      studentEmail: "maria.garcia@student.edu",
      cvContent: "Final year Computer Science student specializing in frontend development. Experience with React, Vue.js, and modern CSS frameworks. Passionate about creating user-friendly interfaces.",
      status: "approved",
      registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      teacherNotes: "Excellent frontend skills. Perfect fit for this workshop."
    },
    {
      id: "reg-3",
      eventId: "sample-event-1",
      studentId: "student-3",
      studentName: "John Smith",
      studentEmail: "john.smith@student.edu",
      cvContent: "First year student with basic programming knowledge in Python and Java. Eager to learn web development and expand my skillset. No prior experience with React but motivated to learn.",
      status: "pending",
      registeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "reg-4",
      eventId: "sample-event-2",
      studentId: "student-4",
      studentName: "Emma Wilson",
      studentEmail: "emma.wilson@student.edu",
      cvContent: "Third year student with intermediate JavaScript knowledge. Completed courses in data structures and algorithms. Looking to deepen my understanding of advanced JavaScript concepts.",
      status: "approved",
      registeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      teacherNotes: "Good foundation in JavaScript. Will benefit from advanced topics."
    }
  ];
};

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load data from localStorage
    const savedEvents = localStorage.getItem('atlasmeet_events');
    const savedRegistrations = localStorage.getItem('atlasmeet_registrations');
    
    // Check if we're in production and localStorage is available
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    
    try {
      if (savedEvents && isLocalStorageAvailable) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } else {
        // Initialize with sample data
        const sampleEvents = getSampleEvents();
        setEvents(sampleEvents);
        if (isLocalStorageAvailable) {
          localStorage.setItem('atlasmeet_events', JSON.stringify(sampleEvents));
        }
      }
    } catch (error) {
      console.error('Error parsing saved events:', error);
      // Clear corrupted data and initialize with sample data
      if (isLocalStorageAvailable) {
        localStorage.removeItem('atlasmeet_events');
      }
      setEvents(getSampleEvents());
      if (isLocalStorageAvailable) {
        localStorage.setItem('atlasmeet_events', JSON.stringify(getSampleEvents()));
      }
    }
    
    try {
      if (savedRegistrations && isLocalStorageAvailable) {
        const parsedRegistrations = JSON.parse(savedRegistrations);
        setRegistrations(parsedRegistrations);
      } else {
        // Initialize with sample data
        const sampleRegistrations = getSampleRegistrations();
        setRegistrations(sampleRegistrations);
        if (isLocalStorageAvailable) {
          localStorage.setItem('atlasmeet_registrations', JSON.stringify(sampleRegistrations));
        }
      }
    } catch (error) {
      console.error('Error parsing saved registrations:', error);
      // Clear corrupted data and initialize with sample data
      if (isLocalStorageAvailable) {
        localStorage.removeItem('atlasmeet_registrations');
      }
      setRegistrations(getSampleRegistrations());
      if (isLocalStorageAvailable) {
        localStorage.setItem('atlasmeet_registrations', JSON.stringify(getSampleRegistrations()));
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    if ((events.length > 0 || localStorage.getItem('atlasmeet_events')) && isLocalStorageAvailable) {
      try {
        localStorage.setItem('atlasmeet_events', JSON.stringify(events));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
    }
  }, [events]);

  useEffect(() => {
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    if ((registrations.length > 0 || localStorage.getItem('atlasmeet_registrations')) && isLocalStorageAvailable) {
      try {
        localStorage.setItem('atlasmeet_registrations', JSON.stringify(registrations));
      } catch (error) {
        console.error('Error saving registrations to localStorage:', error);
      }
    }
  }, [registrations]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        registeredCount: 0,
      };
      
      setEvents(prev => [...prev, newEvent]);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Create event error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      ));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Update event error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      setEvents(prev => prev.filter(event => event.id !== id));
      setRegistrations(prev => prev.filter(reg => reg.eventId !== id));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Delete event error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const registerForEvent = async (eventId: string, studentId: string, studentName: string, studentEmail: string, cvContent: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if already registered
      const existingRegistration = registrations.find(reg => 
        reg.eventId === eventId && reg.studentId === studentId
      );
      
      if (existingRegistration) {
        setIsLoading(false);
        return false;
      }
      
      const newRegistration: Registration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        studentId,
        studentName,
        studentEmail,
        cvContent,
        status: "pending",
        registeredAt: new Date().toISOString(),
      };
      
      setRegistrations(prev => [...prev, newRegistration]);
      
      // Update event registered count
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, registeredCount: event.registeredCount + 1 } : event
      ));
      
      // Log event registration to Discord
      const event = getEventById(eventId);
      if (event) {
        await discordLogger.logEventRegistration({
          userId: studentId,
          userName: studentName,
          userEmail: studentEmail,
          userRole: 'student',
          websiteId: `ATLAS-${studentId.toUpperCase()}`,
          eventId: eventId,
          eventTitle: event.title,
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Register for event error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string, studentId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      setRegistrations(prev => prev.filter(reg => 
        !(reg.eventId === eventId && reg.studentId === studentId)
      ));
      
      // Update event registered count
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, registeredCount: Math.max(0, event.registeredCount - 1) } : event
      ));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Unregister from event error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const approveRegistration = async (registrationId: string, teacherNotes?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registration = registrations.find(reg => reg.id === registrationId);
      if (!registration) {
        setIsLoading(false);
        return false;
      }

      const event = getEventById(registration.eventId);
      if (!event) {
        setIsLoading(false);
        return false;
      }

      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: "approved", reviewedAt: new Date().toISOString(), teacherNotes } : reg
      ));

      // Send notification to student
      addNotification({
        userId: registration.studentId,
        title: "Application Approved!",
        message: `Your application for "${event.title}" has been approved. You're now registered for this event!`,
        type: "success",
        eventId: registration.eventId,
        eventTitle: event.title,
        actionUrl: `/dashboard/event/${registration.eventId}`,
      });

      // Log approval to Discord
      await discordLogger.logApplicationApproval({
        userId: event.teacherId,
        userName: event.teacherName,
        userEmail: `teacher-${event.teacherId}@atlasmeet.com`,
        userRole: 'teacher',
        websiteId: `ATLAS-${event.teacherId.toUpperCase()}`,
        eventId: registration.eventId,
        eventTitle: event.title,
        studentId: registration.studentId,
        studentName: registration.studentName,
        teacherNotes,
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Approve registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const rejectRegistration = async (registrationId: string, teacherNotes?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registration = registrations.find(reg => reg.id === registrationId);
      if (!registration) {
        setIsLoading(false);
        return false;
      }

      const event = getEventById(registration.eventId);
      if (!event) {
        setIsLoading(false);
        return false;
      }

      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: "rejected", reviewedAt: new Date().toISOString(), teacherNotes } : reg
      ));

      // Send notification to student
      addNotification({
        userId: registration.studentId,
        title: "Application Update",
        message: `Your application for "${event.title}" was not approved at this time.`,
        type: "info",
        eventId: registration.eventId,
        eventTitle: event.title,
        actionUrl: `/dashboard/event/${registration.eventId}`,
      });

      // Log rejection to Discord
      await discordLogger.logApplicationRejection({
        userId: event.teacherId,
        userName: event.teacherName,
        userEmail: `teacher-${event.teacherId}@atlasmeet.com`,
        userRole: 'teacher',
        websiteId: `ATLAS-${event.teacherId.toUpperCase()}`,
        eventId: registration.eventId,
        eventTitle: event.title,
        studentId: registration.studentId,
        studentName: registration.studentName,
        teacherNotes,
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Reject registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const getRegistrationsByEventId = (eventId: string): Registration[] => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getPendingRegistrationsByEventId = (eventId: string): Registration[] => {
    return registrations.filter(reg => reg.eventId === eventId && reg.status === "pending");
  };

  const getApprovedRegistrationsByEventId = (eventId: string): Registration[] => {
    return registrations.filter(reg => reg.eventId === eventId && reg.status === "approved");
  };

  const getEventsByTeacherId = (teacherId: string): Event[] => {
    return events.filter(event => event.teacherId === teacherId);
  };

  const getRegistrationsByStudentId = (studentId: string): Registration[] => {
    return registrations.filter(reg => reg.studentId === studentId);
  };

  const searchEvents = (query: string, filters?: { category?: string; location?: string; teacherName?: string }): Event[] => {
    return events.filter(event => {
      const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase()) ||
                           event.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = filters?.category ? event.category.toLowerCase().includes(filters.category.toLowerCase()) : true;
      const matchesLocation = filters?.location ? event.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchesTeacherName = filters?.teacherName ? event.teacherName.toLowerCase().includes(filters.teacherName.toLowerCase()) : true;
      return matchesQuery && matchesCategory && matchesLocation && matchesTeacherName;
    });
  };

  const updateTeacherProfilePicture = (teacherId: string, profilePicture: string) => {
    setEvents(prev => prev.map(event => 
      event.teacherId === teacherId ? { ...event, teacherProfilePicture: profilePicture } : event
    ));
  };

  const removeTeacherProfilePicture = (teacherId: string) => {
    setEvents(prev => prev.map(event => 
      event.teacherId === teacherId ? { ...event, teacherProfilePicture: undefined } : event
    ));
  };

  const value: EventContextType = {
    events,
    registrations,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    approveRegistration,
    rejectRegistration,
    getEventById,
    getRegistrationsByEventId,
    getPendingRegistrationsByEventId,
    getApprovedRegistrationsByEventId,
    getEventsByTeacherId,
    getRegistrationsByStudentId,
    searchEvents,
    updateTeacherProfilePicture,
    removeTeacherProfilePicture,
    isLoading,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 