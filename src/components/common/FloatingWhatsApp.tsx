import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ customMessage }) => {
  const { getWhatsAppUrl, settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  const url = getWhatsAppUrl(customMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip */}
      <div
        className={`mr-3 px-3 py-1.5 bg-[#231F20] text-[#F9F6F0] text-xs rounded-lg shadow-lg border border-[#D4AF37]/40 transition-all duration-300 pointer-events-none whitespace-nowrap ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="font-medium text-[#D4AF37]">Bridal Concierge:</span> Chat with us on WhatsApp
      </div>

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 border-2 border-[#D4AF37] transition-all transform hover:scale-110 active:scale-95 relative"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Subtle breathing ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
