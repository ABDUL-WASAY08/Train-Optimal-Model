import React, { useEffect, useState } from 'react';
import { Copy, Check, ExternalLink, Globe } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { toast } from 'sonner'; // Optional: if you are using sonner for notifications

function SharePortfolio() {
    const [copied, setCopied] = useState(false);
    const [liveUrl, setLiveUrl] = useState('');
    const { getPortfolioUrl } = useUtilityStore();
    useEffect(() => {
        const fetchPortfolioUrl = async () => {
            try {
                const response = await getPortfolioUrl();

                if (response && response.success) {
                    setLiveUrl(`${window.location.origin}/${response.url}`);
                } else {
                    toast.error(response?.error || "Failed to load portfolio link");
                }
            } catch (err) {
                console.error("Error fetching portfolio URL:", err);
            }
        };

        fetchPortfolioUrl();
    }, [getPortfolioUrl]);

    const handleCopy = async () => {
        try {
            if (!liveUrl) return;
            await navigator.clipboard.writeText(liveUrl);
            setCopied(true);
            toast.success("URL copied successfully!");
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-[#0d1117] backdrop-blur-md border border-[#30363d] rounded-2xl shadow-xl text-[#c9d1d9]'>
            <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-[#238636]/10 border border-[#238636]/30 rounded-xl text-[#3fb950]'>
                    <Globe className='w-5 h-5' />
                </div>
                <div>
                    <h3 className='text-sm font-semibold text-white'>Your Public Portfolio Link</h3>
                    <p className='text-xs text-[#8b949e]'>Share your live portfolio link with recruiters and friends.</p>
                </div>
            </div>

            <div className='bg-[#161b22] border border-[#30363d] rounded-xl px-3.5 py-2.5 mb-4'>
                <span className='text-xs text-[#58a6ff] font-mono break-all select-all'>
                    {liveUrl || "Generating portfolio link..."}
                </span>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={handleCopy}
                    disabled={!liveUrl}
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 text-gray-200 text-xs font-medium rounded-xl border border-[#30363d] transition-all duration-200 cursor-pointer'
                >
                    {copied ? (
                        <>
                            <Check className='w-4 h-4 text-[#3fb950]' />
                            <span className='text-[#3fb950] font-semibold'>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className='w-4 h-4 text-[#8b949e]' />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>

                <a
                    href={liveUrl || "#"}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#238636]/20 cursor-pointer border border-[#2ea043] ${!liveUrl ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <ExternalLink className='w-4 h-4 shrink-0' />
                    <span>Open Portfolio</span>
                </a>
            </div>
        </div>
    );
}

export default SharePortfolio;