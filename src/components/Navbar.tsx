import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Search, 
  Compass, 
  Mic2, 
  BookOpen, 
  FileText, 
  Settings,
  Clock,
  Activity,
  Bell,
  User,
  ShieldCheck,
  Sun,
  Moon,
  Type,
  Check
} from 'lucide-react';
import { FieldCategory, UserProfile } from '../types';
import { FIELD_MOTIVATION_CONFIG } from '../data/staticData';

interface NavbarProps {
  activeTab: 'daily' | 'journeys' | 'seek' | 'practice' | 'vocab' | 'cheatsheets' | 'articulation';
  setActiveTab: (tab: 'daily' | 'journeys' | 'seek' | 'practice' | 'vocab' | 'cheatsheets' | 'articulation') => void;
  userProfile: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  fontFamily: 'serif' | 'sans' | 'mono';
  onChangeFontFamily: (font: 'serif' | 'sans' | 'mono') => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onStartDailyWorkout: () => void;
  todayCompleted: boolean;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  theme,
  onToggleTheme,
  fontFamily,
  onChangeFontFamily,
  onOpenSettings,
  onOpenAuth,
  onOpenNotifications,
  onStartDailyWorkout,
  todayCompleted,
  unreadNotificationsCount = 2
}) => {
  const currentFieldConfig = FIELD_MOTIVATION_CONFIG[userProfile.field] || FIELD_MOTIVATION_CONFIG.general;
  const isDark = theme === 'dark';
  const [showTypographyMenu, setShowTypographyMenu] = useState<boolean>(false);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur border-b transition-all ${
      isDark 
        ? 'bg-[#09090B]/95 border-[#27272A] text-[#F4F4F5]' 
        : 'bg-[#FAF8F5]/95 border-[#E2DDD4] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brain Tracker Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('daily')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shadow-xs transition-colors ${
                isDark 
                  ? 'bg-[#18181B] text-[#FB923C] border-[#27272A] group-hover:border-[#FB923C]' 
                  : 'bg-[#18181B] text-white border-[#27272A] group-hover:bg-[#C2410C]'
              }`}>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial-heading font-bold text-lg sm:text-2xl tracking-tight text-inherit">
                    RISE <span className="italic font-serif text-[#C2410C] dark:text-[#FB923C]">OS</span>
                  </span>
                  <span className={`hidden sm:inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-[0.14em] font-mono rounded-full border ${
                    isDark 
                      ? 'bg-[#222226] text-[#22C55E] border-[#27272A]' 
                      : 'bg-[#F5F2EB] text-[#52525B] border-[#E2DDD4]'
                  }`}>
                    Speech & Vitals
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-[#A1A1AA] hidden md:block tracking-wide font-editorial-sans">
                  Executive Communication & Brain Fitness Operating System
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Today's Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab('articulation')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'articulation'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" />
              <span>Vocal Fitness</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'practice'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5 text-[#15803D] dark:text-[#22C55E]" />
              <span>AI Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('seek')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'seek'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              <span>SEEK Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('journeys')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'journeys'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Skill Tracks</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'vocab'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#A78BFA]" />
              <span>Lexicon Deck</span>
            </button>

            <button
              onClick={() => setActiveTab('cheatsheets')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cheatsheets'
                  ? (isDark ? 'bg-[#222226] text-white border border-[#3F3F46] font-bold shadow-xs' : 'bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] font-bold shadow-xs')
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-inherit hover:bg-inherit/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Index Cards</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Dark / Light Minimalist Switcher */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#18181B] border-[#27272A] hover:bg-[#222226] text-[#FB923C]' 
                  : 'bg-white border-[#E2DDD4] hover:bg-[#F5F2EB] text-[#C2410C]'
              }`}
              title={isDark ? 'Switch to Paperwhite Light Mode' : 'Switch to Obsidian Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Typography Chooser Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowTypographyMenu(!showTypographyMenu)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isDark ? 'bg-[#18181B] border-[#27272A] hover:bg-[#222226]' : 'bg-white border-[#E2DDD4] hover:bg-[#F5F2EB]'
                }`}
                title="E-Reader Font Settings"
              >
                <Type className="w-4 h-4 opacity-80" />
              </button>

              {showTypographyMenu && (
                <div className={`absolute right-0 top-12 w-48 rounded-2xl border p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' : 'bg-white border-[#E2DDD4] text-[#18181B]'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#64748B] dark:text-[#A1A1AA] px-2 py-1 block">
                    Reader Typography
                  </span>
                  <div className="space-y-1 mt-1 text-xs">
                    <button
                      onClick={() => { onChangeFontFamily('serif'); setShowTypographyMenu(false); }}
                      className={`w-full px-2.5 py-1.5 rounded-xl font-serif text-left flex items-center justify-between cursor-pointer ${
                        fontFamily === 'serif' ? (isDark ? 'bg-[#222226] font-bold' : 'bg-[#F5F2EB] font-bold') : 'hover:bg-inherit/80'
                      }`}
                    >
                      <span>Editorial Serif</span>
                      {fontFamily === 'serif' && <Check className="w-3.5 h-3.5 text-[#C2410C]" />}
                    </button>
                    <button
                      onClick={() => { onChangeFontFamily('sans'); setShowTypographyMenu(false); }}
                      className={`w-full px-2.5 py-1.5 rounded-xl font-sans text-left flex items-center justify-between cursor-pointer ${
                        fontFamily === 'sans' ? (isDark ? 'bg-[#222226] font-bold' : 'bg-[#F5F2EB] font-bold') : 'hover:bg-inherit/80'
                      }`}
                    >
                      <span>Modern Sans</span>
                      {fontFamily === 'sans' && <Check className="w-3.5 h-3.5 text-[#C2410C]" />}
                    </button>
                    <button
                      onClick={() => { onChangeFontFamily('mono'); setShowTypographyMenu(false); }}
                      className={`w-full px-2.5 py-1.5 rounded-xl font-mono text-left flex items-center justify-between cursor-pointer ${
                        fontFamily === 'mono' ? (isDark ? 'bg-[#222226] font-bold' : 'bg-[#F5F2EB] font-bold') : 'hover:bg-inherit/80'
                      }`}
                    >
                      <span>JetBrains Mono</span>
                      {fontFamily === 'mono' && <Check className="w-3.5 h-3.5 text-[#C2410C]" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Streak Counter */}
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold font-mono shadow-2xs ${
              isDark ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#18181B]'
            }`}>
              <Flame className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C] fill-current" />
              <span>{userProfile.streakDays}d</span>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-[#18181B] border-[#27272A] hover:bg-[#222226]' : 'bg-white border-[#E2DDD4] hover:bg-[#F5F2EB]'
              }`}
              title="Daily Vocab & Feedback Retention"
            >
              <Bell className="w-4 h-4 text-inherit opacity-80" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C2410C] text-white text-[9px] font-bold flex items-center justify-center border-2 border-inherit">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                userProfile.auth?.isLoggedIn
                  ? (isDark ? 'bg-[#222226] text-[#F4F4F5] border-[#3F3F46]' : 'bg-[#F5F2EB] text-[#18181B] border-[#D5D0C5]')
                  : 'bg-[#18181B] text-white hover:bg-black border-[#18181B]'
              }`}
              title={userProfile.auth?.isLoggedIn ? `Signed in as ${userProfile.auth.email || userProfile.auth.phoneNumber}` : 'Join with Gmail or Phone'}
            >
              {userProfile.auth?.isLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] dark:text-[#22C55E]" />
                  <span className="max-w-[70px] sm:max-w-[90px] truncate">
                    {userProfile.name}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Field Settings */}
            <button
              onClick={onOpenSettings}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-[#18181B] border-[#27272A] hover:bg-[#222226]' : 'bg-white border-[#E2DDD4] hover:bg-[#F5F2EB]'
              }`}
              title="Career Field & Settings"
            >
              <Settings className="w-4 h-4 opacity-80" />
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur border-t px-2 py-1.5 flex items-center justify-around ${
        isDark ? 'bg-[#09090B]/95 border-[#27272A] text-[#F4F4F5]' : 'bg-[#FAF8F5]/95 border-[#E2DDD4] text-[#18181B]'
      }`}>
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium ${
            activeTab === 'daily' ? 'text-[#C2410C] dark:text-[#FB923C] font-bold' : 'opacity-60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab('articulation')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium ${
            activeTab === 'articulation' ? 'text-[#C2410C] dark:text-[#FB923C] font-bold' : 'opacity-60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vocal</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium ${
            activeTab === 'practice' ? 'text-[#15803D] dark:text-[#22C55E] font-bold' : 'opacity-60'
          }`}
        >
          <Mic2 className="w-4 h-4" />
          <span>Arena</span>
        </button>

        <button
          onClick={() => setActiveTab('journeys')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium ${
            activeTab === 'journeys' ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold' : 'opacity-60'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Tracks</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium ${
            activeTab === 'vocab' ? 'text-[#4F46E5] dark:text-[#A78BFA] font-bold' : 'opacity-60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lexicon</span>
        </button>
      </div>
    </header>
  );
};

