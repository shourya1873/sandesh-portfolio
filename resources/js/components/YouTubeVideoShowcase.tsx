import React, { useEffect, useMemo, useState } from 'react';

const YouTubeVideoShowcase = () => {
    const [videoTitle, setVideoTitle] = useState('');
    const [error, setError] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState('');
    const [videoDetails, setVideoDetails] = useState([]);

    const videos = useMemo(() => [
        {
            videoId: '6fIb21E4Rg4',
        },
        // Add more videos here if needed
    ], []);

    const videoMap = useMemo(
        () => Object.fromEntries(videoDetails?.map((v:any) => [v.videoId, v])),
        [videoDetails]
    );

    const fetchVideoDetails = async () => {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        try {
            const results = await Promise.all(
                videos.map(async (video) => {
                    const res = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${video.videoId}&key=${apiKey}`
                    );
                    const data = await res.json();
                    if (data.items?.length > 0) {
                        const item = data.items[0];
                        return {
                            ...video,
                            fetchedTitle: item.snippet.title,
                            snippet: item.snippet,
                            statistics: item.statistics,
                        };
                    } else {
                        throw new Error('Video not found');
                    }
                })
            );

            setVideoDetails(results);
            setSelectedVideoId(results[0].videoId);
            setVideoTitle(results[0].fetchedTitle);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch video');
        }
    };

    useEffect(() => {
        fetchVideoDetails();
    }, []);

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideoId(videoId);
        setVideoTitle(videoMap[videoId]?.fetchedTitle || '');
    };

    const formatViews = (viewCount: number) =>
        viewCount ? new Intl.NumberFormat().format(viewCount) : '0';

    const formatDate = (dateStr: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString() : '';

    return (
        <section className="bg-black text-white py-16 px-6 lg:px-24">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Featured Speaking</h2>
                <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                    Discover my talks, presentations, and panel discussions from various tech conferences and events
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Video Player */}
                <div className="lg:w-2/3">
                    <div className="bg-white/5 rounded-lg overflow-hidden shadow-lg">
                        {selectedVideoId ? (
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    className="w-full h-[500px]"
                                    src={`https://www.youtube.com/embed/${selectedVideoId}`}
                                    title={videoTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[500px] bg-white/5">
                                <p className="text-gray-400">Select a video to play</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video List */}
                <div className="lg:w-1/3">
                    <div className="bg-white/5 rounded-lg p-4 h-full">
                        <h3 className="text-xl font-semibold mb-4 text-primary">My Videos</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {videos.map((video) => {
                                const videoData = videoMap[video.videoId];
                                return (
                                    <div
                                        key={video.videoId}
                                        onClick={() => handleVideoSelect(video.videoId)}
                                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition ${
                                            selectedVideoId === video.videoId
                                                ? 'bg-white text-black bg-opacity-50'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 w-24 h-16 rounded overflow-hidden">
                                            <img
                                                src={videoData?.snippet?.thumbnails?.standard?.url || videoData?.snippet?.thumbnails?.default?.url}
                                                alt={videoData?.snippet?.title || videoData?.snippet?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2">{videoData?.snippet?.title}</h4>
                                            <div className="flex items-center mt-1 text-xs text-gray-400">
                                                <span>{formatDate(videoData?.snippet?.publishedAt)}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatViews(videoData?.statistics?.viewCount)} views</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default YouTubeVideoShowcase;
