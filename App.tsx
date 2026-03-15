import React, { useState, useRef, useEffect, useCallback } from 'react';
import { JobResult, JobStatus } from './types';
import { scrapeJobsFromPage, callGeminiAPI } from './services/jobService';
import { useAudio } from './hooks/useAudio';
import MatrixRain from './components/MatrixRain';

const SOUND_FILES = {
  click: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c84890354b.mp3',
  typing: 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_821727c3b2.mp3',
  start: 'https://cdn.pixabay.com/download/audio/2022/03/29/audio_3988582f34.mp3',
  success: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_06f8742618.mp3',
  skipped: 'https://cdn.pixabay.com/download/audio/2022/03/07/audio_51c626d71b.mp3',
  finish: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_088cb66a3a.mp3'
};

const GlowCard: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-black/70 border border-[#00FF41] rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.5)] p-4 backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const App: React.FC = () => {
    const [resume, setResume] = useState('');
    const [keywords, setKeywords] = useState('React, TypeScript, Node.js');
    const [url, setUrl] = useState('https://www.linkedin.com/jobs');
    const [logs, setLogs] = useState<string[]>(['[LOG] AI Job Hunter initialized. Standby for commands.']);
    const [results, setResults] = useState<JobResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    
    const isCancelledRef = useRef(false);
    const logTextareaRef = useRef<HTMLTextAreaElement>(null);
    const playSound = useAudio(SOUND_FILES);

    const handleTypingSound = useCallback(() => playSound('typing'), [playSound]);

    useEffect(() => {
        if (logTextareaRef.current) {
            logTextareaRef.current.scrollTop = logTextareaRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };
    
    const handleStart = async () => {
        playSound('start');
        addLog('Bot sequence initiated...');
        isCancelledRef.current = false;
        setIsRunning(true);
        setResults([]);

        addLog(`Scraping jobs from ${url}...`);
        try {
            const jobs = await scrapeJobsFromPage();
            addLog(`Found ${jobs.length} potential job listings.`);

            let appliedCount = 0;
            let skippedCount = 0;

            for (let i = 0; i < jobs.length; i++) {
                if (isCancelledRef.current) {
                    addLog('...Bot sequence manually terminated by user.');
                    playSound('finish');
                    break;
                }

                const job = jobs[i];
                addLog(`[${i + 1}/${jobs.length}] Analyzing job: "${job.title}" at ${job.company}`);
                
                const initialResult: JobResult = { ...job, id: i, status: 'Pending' };
                setResults(prev => [...prev, initialResult]);

                const matchResult = await callGeminiAPI(resume, job.description, keywords);
                
                let finalStatus: JobStatus = 'Skipped';
                if (matchResult === 'Yes') {
                    finalStatus = 'Applied';
                    appliedCount++;
                    addLog(`>> Match found. Simulating application.`);
                    playSound('success');
                } else {
                    skippedCount++;
                    addLog(`>> No match found. Skipping.`);
                    playSound('skipped');
                }

                setResults(prev => prev.map(r => r.id === i ? { ...r, status: finalStatus } : r));
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            if (!isCancelledRef.current) {
                addLog(`Cycle complete. Applied: ${appliedCount}, Skipped: ${skippedCount}.`);
                playSound('finish');
            }

        } catch (error) {
            addLog(`ERROR: An unexpected error occurred. ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsRunning(false);
        }
    };
    
    const handleStop = () => {
        playSound('click');
        isCancelledRef.current = true;
    };

    const getStatusColor = (status: JobStatus) => {
        switch(status) {
            case 'Applied': return 'text-[#00FF41]';
            case 'Skipped': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-black text-[#E0E0E0] min-h-screen font-mono flex flex-col">
            <MatrixRain />
            
            <header className="fixed top-0 left-0 right-0 bg-black/80 border-b border-[#00FF41] p-3 z-10 backdrop-blur-sm">
                <h1 className="text-xl md:text-2xl text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">
                    &gt; AI_Job_Hunter<span className="blinking-cursor">_</span>
                </h1>
            </header>

            <main className="flex-grow pt-20 pb-12 px-4 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {/* Left Column: Control Panel */}
                    <div className="flex flex-col gap-4">
                        <GlowCard className="flex-grow flex flex-col">
                            <label className="text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">Resume / Bio:</label>
                            <textarea
                                value={resume}
                                onChange={e => setResume(e.target.value)}
                                onKeyDown={handleTypingSound}
                                placeholder="Paste your resume or bio here..."
                                className="mt-2 w-full flex-grow bg-black/50 border border-[#00FF41]/50 p-2 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-sm resize-none"
                            />
                        </GlowCard>
                        <GlowCard>
                            <label className="text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">Keywords (comma-separated):</label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={e => setKeywords(e.target.value)}
                                onKeyDown={handleTypingSound}
                                className="mt-2 w-full bg-black/50 border border-[#00FF41]/50 p-2 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-sm"
                            />
                        </GlowCard>
                        <GlowCard>
                            <label className="text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">Target Job Site URL:</label>
                            <input
                                type="text"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                onKeyDown={handleTypingSound}
                                className="mt-2 w-full bg-black/50 border border-[#00FF41]/50 p-2 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-sm"
                            />
                        </GlowCard>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { playSound('click'); handleStart(); }}
                                disabled={isRunning}
                                className="p-3 bg-green-900/50 border border-[#00FF41] text-[#00FF41] rounded-sm transition-all duration-300 hover:bg-[#00FF41] hover:text-black hover:shadow-[0_0_20px_#00FF41] disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed"
                            >
                                ./start_bot.sh
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={!isRunning}
                                className="p-3 bg-red-900/50 border border-[#F44336] text-[#F44336] rounded-sm transition-all duration-300 hover:bg-[#F44336] hover:text-black hover:shadow-[0_0_20px_#F44336] disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed"
                            >
                                Stop -9
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Status Display */}
                    <div className="flex flex-col gap-4 h-[calc(100vh-10rem)] md:h-auto">
                        <GlowCard className="flex-grow flex flex-col h-1/2">
                            <h2 className="text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">Live Log:</h2>
                            <textarea
                                ref={logTextareaRef}
                                readOnly
                                value={logs.join('\n')}
                                className="mt-2 w-full h-full bg-black/50 border border-[#00FF41]/50 p-2 focus:outline-none rounded-sm resize-none text-sm"
                            />
                        </GlowCard>
                        <GlowCard className="flex-grow flex flex-col h-1/2">
                             <h2 className="text-[#00FF41] [text-shadow:0_0_5px_#00FF41]">Results:</h2>
                             <div className="mt-2 overflow-auto h-full">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#00FF41]/50">
                                            <th className="p-2">Job Title</th>
                                            <th className="p-2">Company</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map(job => (
                                            <tr key={job.id} className="border-b border-gray-800 hover:bg-green-900/20">
                                                <td className="p-2">{job.title}</td>
                                                <td className="p-2 text-gray-400">{job.company}</td>
                                                <td className={`p-2 font-bold ${getStatusColor(job.status)}`}>{job.status}</td>
                                                <td className="p-2">
                                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline hover:text-cyan-300">
                                                        [view]
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </GlowCard>
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-[#00FF41] text-center p-1 text-xs text-gray-500 z-10 backdrop-blur-sm">
                &copy; 2024 AI_Job_Hunter. Secure session established.
            </footer>
        </div>
    );
};

export default App;
