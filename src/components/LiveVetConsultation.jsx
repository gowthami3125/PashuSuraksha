import React, { useState, useEffect, useRef } from 'react';
import { Video, PhoneCall, Mic, MicOff, Camera, Wifi, Volume2, ShieldCheck, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function LiveVetConsultation({ lang, currentCase, currentVetUser, onInspectPhoto, doctorQueue }) {
  const activeCase = currentCase || (doctorQueue && doctorQueue[0]) || {
    id: 'CASE-2026-901',
    farmerName: 'Anandrao Patil',
    farmerMobile: '9822012345',
    location: 'Haveli Taluka, Pune, Maharashtra',
    species: 'Cattle (Crossbred Cow)',
    predictedDisease: 'Foot and Mouth Disease (FMD)',
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80'
  };

  const [userRole, setUserRole] = useState('farmer'); // 'farmer' or 'veterinarian'
  const [userName, setUserName] = useState('Anandrao Patil (Farmer)');
  const [roomId, setRoomId] = useState('PashuSuraksha-Haveli-101');
  const [joined, setJoined] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  // Chat messages
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'System Dispatch', message: 'Tele-consultation room initialized for Haveli Taluka. 1962 Veterinary Officer on standby.', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const socketRef = useRef(null);

  const jitsiRoomUrl = `https://meet.jit.si/${encodeURIComponent(roomId)}`;

  useEffect(() => {
    try {
      const socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      socketRef.current = socket;

      socket.on('receive_chat_message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      return () => {
        socket.disconnect();
      };
    } catch (e) {
      console.warn("Socket connection fallback");
    }
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    setJoined(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: userName,
      message: inputMsg,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMsg]);
    if (socketRef.current) {
      socketRef.current.emit('send_chat_message', { roomId, ...newMsg });
    }
    setInputMsg('');
  };

  return (
    <div className="gov-card p-6 mb-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D1D5DB] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB] rounded-lg font-bold text-xl">
            <Video className="w-6 h-6 text-[#0F2F5C]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">1962 Tele-Consultation & Direct Vet Conference</h2>
            <p className="text-xs text-[#4B5563]">
              Encrypted video consultation room powered by Jitsi for farmers, para-vets, and 1962 Veterinary Officers.
            </p>
          </div>
        </div>

        <a 
          href="tel:1962"
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-2 transition"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call Me On Phone (1962)</span>
        </a>
      </div>

      {!joined ? (
        <form onSubmit={handleJoinRoom} className="max-w-md mx-auto bg-[#F3F4F6] p-6 rounded-lg border border-[#D1D5DB] space-y-4">
          <h3 className="font-bold text-[#111827] text-sm text-center">Join Consultation Room</h3>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setUserRole('farmer'); setUserName('Anandrao Patil (Farmer)'); }}
                className={`py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                  userRole === 'farmer' ? 'bg-[#0F2F5C] text-white border-[#0F2F5C]' : 'bg-white text-[#111827] border-[#D1D5DB]'
                }`}
              >
                👨‍🌾 Farmer / Para-Vet
              </button>
              <button
                type="button"
                onClick={() => { setUserRole('veterinarian'); setUserName(currentVetUser ? currentVetUser.name : 'Dr. S. K. Kulkarni (Vet Officer)'); }}
                className={`py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                  userRole === 'veterinarian' ? 'bg-[#0F2F5C] text-white border-[#0F2F5C]' : 'bg-white text-[#111827] border-[#D1D5DB]'
                }`}
              >
                👨‍⚕️ Veterinary Officer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Your Name</label>
            <input
              type="text"
              required
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-xs bg-white font-semibold text-[#111827]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Jitsi Consultation Room ID</label>
            <input
              type="text"
              required
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-xs bg-white font-mono text-[#111827]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input 
              type="checkbox"
              id="audioOnly"
              checked={isAudioOnly}
              onChange={e => setIsAudioOnly(e.target.checked)}
              className="rounded border-[#D1D5DB] text-[#0F2F5C] focus:ring-[#0F2F5C] cursor-pointer"
            />
            <label htmlFor="audioOnly" className="text-xs font-semibold text-[#4B5563] cursor-pointer">
              Low-bandwidth Audio-Only Mode (for weak 2G/3G networks)
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-navy py-3 rounded-lg text-xs cursor-pointer"
          >
            Enter Jitsi Consultation Room →
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Jitsi Meeting Frame / Stream Window */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-[#0B2447] rounded-lg overflow-hidden aspect-video border border-[#0F2F5C]">
              {!isAudioOnly ? (
                <iframe
                  src={`${jitsiRoomUrl}#config.prejoinPageEnabled=false`}
                  title="Jitsi Video Consultation"
                  className="w-full h-full border-0"
                  allow="camera; microphone; display-capture; autoplay; clipboard-write"
                />
              ) : (
                <div className="w-full h-full bg-[#0B2447] flex flex-col items-center justify-center text-white p-6 space-y-4 text-center">
                  <Volume2 className="w-16 h-16 text-blue-300 animate-pulse" />
                  <h4 className="text-base font-bold">Audio-Only Consultation Active</h4>
                  <p className="text-xs text-blue-100 max-w-sm">
                    Operating in low-bandwidth mode. Speak directly with the duty veterinary officer.
                  </p>
                  <a
                    href={jitsiRoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-xs font-bold px-4 py-2 rounded-lg border border-[#D1D5DB]/30"
                  >
                    Open Jitsi App Window
                  </a>
                </div>
              )}

              {/* Call Controls Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-[#0B2447] px-4 py-2 rounded-lg border border-[#D1D5DB]/30">
                <a
                  href="tel:1962"
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 1962</span>
                </a>

                <button
                  onClick={() => setIsAudioOnly(!isAudioOnly)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isAudioOnly ? 'bg-[#D97706] text-[#111827]' : 'bg-[#0F2F5C] text-white hover:bg-[#0B2447]'
                  }`}
                >
                  {isAudioOnly ? 'Video Mode' : 'Audio Only'}
                </button>

                <button
                  onClick={() => setJoined(false)}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Leave Room
                </button>
              </div>
            </div>

            {/* Case Summary Panel */}
            <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-4 rounded-lg text-xs space-y-3 text-[#111827]">
              <div className="flex items-center justify-between">
                <h4 className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F2F5C]" />
                  <span>Active Consultation Case Summary</span>
                </h4>
                <span className="bg-[#0F2F5C] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  CASE #{activeCase?.id || 'CASE-2026-901'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#D1D5DB]">
                <div className="space-y-1">
                  <p className="text-[#4B5563]">
                    Farmer: <strong>{activeCase?.farmerName || 'Anandrao Patil'}</strong> — Location: <strong>{activeCase?.location || 'Haveli Taluka, Pune, Maharashtra'}</strong>
                  </p>
                  <p className="text-[#4B5563]">
                    Animal: <strong>{activeCase?.species || 'Cattle (Crossbred Cow)'}</strong> — Diagnosis: <strong className="text-[#DC2626]">{activeCase?.predictedDisease || 'Foot and Mouth Disease (FMD)'}</strong>
                  </p>
                </div>

                {(activeCase?.photoUrl || activeCase?.attachedMedia) && (
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <img 
                      src={activeCase?.photoUrl || activeCase?.attachedMedia?.dataUrl} 
                      alt="Lesion thumbnail" 
                      onClick={() => onInspectPhoto && onInspectPhoto(activeCase)}
                      className="w-12 h-12 object-cover rounded border border-[#D1D5DB] cursor-pointer hover:opacity-80 transition"
                      title="Inspect clinical photo"
                    />
                    <button
                      type="button"
                      onClick={() => onInspectPhoto && onInspectPhoto(activeCase)}
                      className="btn-navy px-3 py-1.5 text-xs rounded-md font-bold cursor-pointer flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Inspect Photo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live In-App Consultation Chat */}
          <div className="flex flex-col bg-[#F3F4F6] rounded-lg border border-[#D1D5DB] h-[450px] p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB] mb-3">
              <h4 className="font-bold text-[#111827] text-xs">💬 Consultation Notes ({roomId})</h4>
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg ${
                  m.sender === 'System Dispatch' ? 'bg-white text-[#111827] border border-[#D1D5DB] text-[10px]' :
                  m.sender === userName ? 'bg-[#0F2F5C] text-white ml-4' : 'bg-white text-[#111827] border border-[#D1D5DB] mr-4'
                }`}>
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1">
                    <span className="font-bold">{m.sender}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex space-x-2 pt-2 border-t border-[#D1D5DB]">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type note or message..."
                className="flex-1 border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#0F2F5C] font-medium text-[#111827]"
              />
              <button
                type="submit"
                className="btn-navy px-3.5 py-2 text-xs cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
