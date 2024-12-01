export const ChatBackground = () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="chat-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10h20v20H10z" fill="#64748b" fillOpacity="0.03" />
                <circle cx="50" cy="50" r="15" fill="#64748b" fillOpacity="0.03" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f8fafc" />
        <rect width="100%" height="100%" fill="url(#chat-pattern)" />
    </svg>
); 