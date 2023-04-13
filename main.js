import './style.css';

// YOUTUBE VIDEO PLAYER
new YT.Player('backgroundVideo', {
  videoId: 'DbuebKNKQsQ',
  playerVars: {
    start: 9,
    controls: 0,
    autoplay: 1,
    loop: 1,
    modestbranding: 1,
    playsinline: 1,
  },
  events: {
    onReady: onPlayerReady,
  },
});

function onPlayerReady(event) {
  event.target.playVideo();
}
// YOUTUBE VIDEO PLAYER
