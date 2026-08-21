import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  User, 
  Lock, 
  Globe, 
  LogOut
} from 'lucide-react';
import { UserProfile, UserAuth } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLoginSuccess: (authData: UserAuth, updatedName?: string) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess,
  onSignOut
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  
  // Google / Gmail inputs
  const [gmailEmail, setGmailEmail] = useState<string>(userProfile.auth.email || 'tamannajangra313@gmail.com');
  const [gmailName, setGmailName] = useState<string>(userProfile.name || 'Tamanna');
  
  // Phone inputs
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.auth.phoneNumber || '9876543210');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('482910');
  const [phoneUserName, setPhoneUserName] = useState<string>(userProfile.name || 'Member');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = (emailToUse?: string) => {
    const email = emailToUse || gmailEmail;
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newAuth: UserAuth = {
        isLoggedIn: true,
        authMethod: 'google',
        email: email.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        accountCreatedDate: new Date().toISOString()
      };
      setSuccessMessage(`Successfully signed in as ${email}`);
      setTimeout(() => {
        onLoginSuccess(newAuth, gmailName);
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }, 800);
  };

  const handleSendOtp = () => {
    if (!phoneNumber.trim() || phoneNumber.length < 8) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newAuth: UserAuth = {
        isLoggedIn: true,
        authMethod: 'phone',
        phoneNumber: `${countryCode} ${phoneNumber}`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phoneNumber)}`,
        accountCreatedDate: new Date().toISOString()
      };
      setSuccessMessage(`Phone verified! Welcome ${phoneUserName}`);
      setTimeout(() => {
        onLoginSuccess(newAuth, phoneUserName);
        setSuccessMessage(null);
        setOtpStep(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-editorial-sans">
      <div className="bg-[#FAF8F5] text-[#18181B] w-full max-w-lg rounded-3xl border border-[#E2DDD4] shadow-xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#E2DDD4] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-[#FAF8F5] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <h2 className="font-editorial-heading font-serif font-bold text-xl text-[#18181B]">
                Join RISE <span className="italic text-[#C2410C]">OS</span>
              </h2>
              <p className="text-xs text-[#64748B]">
                Universal access for anyone via Gmail or Phone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F2EB] text-[#64748B] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If already logged in: Account Overview */}
        {userProfile.auth.isLoggedIn && !successMessage && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E2DDD4] space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#18181B] text-white flex items-center justify-center text-lg font-bold font-serif">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-editorial-heading font-serif font-bold text-base text-[#18181B] truncate">
                      {userProfile.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold border border-[#BBF7D0]">
                      Active Sync
                    </span>
                  </div>
                  <p className="text-xs text-[#52525B] truncate">
                    {userProfile.auth.authMethod === 'google' 
                      ? userProfile.auth.email 
                      : userProfile.auth.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EDE9E0] flex items-center justify-between text-xs text-[#64748B]">
                <span>Auth: <strong className="capitalize text-[#18181B]">{userProfile.auth.authMethod}</strong></span>
                <span>Streak: <strong className="text-[#C2410C]">{userProfile.streakDays} Days</strong></span>
                <span>XP: <strong className="text-[#18181B]">{userProfile.xpPoints}</strong></span>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Account Actions
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onSignOut();
                  }}
                  className="flex-1 py-3 bg-[#FAF8F5] border border-[#E2DDD4] hover:border-[#B91C1C] hover:text-[#B91C1C] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login / Sign Up Tabs if Not Logged In or Switching */}
        {(!userProfile.auth.isLoggedIn || successMessage) && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {successMessage ? (
              <div className="p-6 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-[#15803D] mx-auto" />
                <h3 className="font-editorial-heading font-serif font-bold text-lg text-[#15803D]">
                  {successMessage}
                </h3>
                <p className="text-xs text-[#15803D]">
                  Syncing your personalized 15-minute journeys and speech simulator history...
                </p>
              </div>
            ) : (
              <>
                {/* Method Selector Tabs */}
                <div className="flex items-center gap-2 p-1 bg-[#EDE9E0] rounded-full">
                  <button
                    onClick={() => {
                      setAuthMethod('google');
                      setOtpStep(false);
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMethod === 'google'
                        ? 'bg-[#18181B] text-[#FAF8F5] shadow-2xs'
                        : 'text-[#52525B] hover:text-[#18181B]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Sign in with Google / Gmail</span>
                  </button>

                  <button
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMethod === 'phone'
                        ? 'bg-[#18181B] text-[#FAF8F5] shadow-2xs'
                        : 'text-[#52525B] hover:text-[#18181B]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone Number</span>
                  </button>
                </div>

                {/* Google / Gmail Login Section */}
                {authMethod === 'google' && (
                  <div className="space-y-4 animate-in fade-in">
                    
                    {/* 1-Click Quick Preset for seamless join */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2DDD4] space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          1-Click Fast Connect
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#C2410C] font-bold">
                          Verified
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleGoogleLogin('tamannajangra313@gmail.com')}
                        disabled={isLoading}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DDD4] hover:border-[#18181B] hover:bg-white text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center font-bold text-xs">
                            G
                          </div>
                          <div>
                            <strong className="text-xs text-[#18181B] block group-hover:text-[#C2410C] transition-colors">
                              tamannajangra313@gmail.com
                            </strong>
                            <span className="text-[10px] text-[#64748B]">Tamanna (Google Account)</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#18181B] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#E2DDD4]"></div>
                      <span className="flex-shrink mx-3 text-[10px] text-[#64748B] uppercase font-bold">Or enter any Gmail</span>
                      <div className="flex-grow border-t border-[#E2DDD4]"></div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={gmailName}
                            onChange={(e) => setGmailName(e.target.value)}
                            placeholder="Your Name (e.g. Tamanna)"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                          Google / Gmail Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={gmailEmail}
                            onChange={(e) => setGmailEmail(e.target.value)}
                            placeholder="you@gmail.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading || !gmailEmail.trim()}
                        className="w-full py-3 bg-[#18181B] hover:bg-black text-[#FAF8F5] font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Authenticating with Google...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
                            <span>Continue with Google</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

                {/* Phone Number Login Section */}
                {authMethod === 'phone' && (
                  <div className="space-y-4 animate-in fade-in">
                    {!otpStep ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={phoneUserName}
                            onChange={(e) => setPhoneUserName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                            Mobile Phone Number
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="px-3 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                            >
                              <option value="+91">🇮🇳 +91 (IN)</option>
                              <option value="+1">🇺🇸 +1 (US)</option>
                              <option value="+44">🇬🇧 +44 (UK)</option>
                              <option value="+971">🇦🇪 +971 (UAE)</option>
                              <option value="+65">🇸🇬 +65 (SG)</option>
                              <option value="+61">🇦🇺 +61 (AU)</option>
                            </select>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="9876543210"
                              className="flex-1 px-4 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>We'll send a 6-digit verification code to this mobile number.</span>
                        </p>

                        <button
                          onClick={handleSendOtp}
                          disabled={isLoading || phoneNumber.length < 7}
                          className="w-full py-3 bg-[#18181B] hover:bg-black text-[#FAF8F5] font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending OTP Code...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Verification OTP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="p-4 bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl text-center space-y-1">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase">Verification Sent To</span>
                          <strong className="block text-sm text-[#18181B] font-mono">{countryCode} {phoneNumber}</strong>
                          <button
                            onClick={() => setOtpStep(false)}
                            className="text-[11px] text-[#C2410C] font-semibold hover:underline cursor-pointer"
                          >
                            Change Phone Number
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1 text-center">
                            Enter 6-Digit OTP Code
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="482910"
                            className="w-full py-3 bg-white border border-[#18181B] rounded-xl text-center text-xl font-mono tracking-[0.3em] font-bold text-[#18181B] focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleVerifyOtp}
                          disabled={isLoading || otpCode.length < 4}
                          className="w-full py-3 bg-[#18181B] hover:bg-black text-[#FAF8F5] font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying OTP...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                              <span>Confirm & Access Account</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* Footer Note */}
        <div className="p-4 bg-[#F5F2EB] border-t border-[#E2DDD4] text-center text-[10px] text-[#64748B] flex items-center justify-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Open to all global professionals, engineers, leaders, and learners.</span>
        </div>

      </div>
    </div>
  );
};
