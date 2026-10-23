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
        <div className='max-w-md mx-auto p-6 card text-slate-800'>
            <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-600'>
                    <Globe className='w-5 h-5' />
                </div>
                <div>
                    <h3 className='text-sm font-semibold text-slate-900'>Your Public Portfolio Link</h3>
                    <p className='text-xs text-slate-500'>Share your live portfolio link with recruiters and friends.</p>
                </div>
            </div>

            <div className='bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 mb-4'>
                <span className='text-xs text-indigo-700 font-mono break-all select-all'>
                    {liveUrl || "Generating portfolio link..."}
                </span>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={handleCopy}
                    disabled={!liveUrl}
                    className='btn-secondary flex-1'
                >
                    {copied ? (
                        <>
                            <Check className='w-4 h-4 text-emerald-500' />
                            <span className='text-emerald-600 font-semibold'>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className='w-4 h-4 text-slate-400' />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>

                <a
                    href={liveUrl || "#"}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`btn-primary flex-1 ${!liveUrl ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <ExternalLink className='w-4 h-4 shrink-0' />
                    <span>Open Portfolio</span>
                </a>
            </div>
        </div>
    );
}

export default SharePortfolio;