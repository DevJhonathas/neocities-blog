const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const songSlider = document.getElementById("slider-song");
const playpauseButton = document.getElementById("playpause-song");
const prevSongButton = document.getElementById("prev-song");
const nextSongButton = document.getElementById("next-song");

const repeatSongButton = document.getElementById("repeat-song");
const shuffleSongButton = document.getElementById("shuffle-song");

const musicplayer = document.getElementById("music-player");

const songs = [
  {
    audio: "cd5s0K9Il9Y",
    name: "Nome da música",
    artist: "Nome do artista",
    image: "/src/img/backgrounds/dangaronpa.webp",
  },
  {
    audio: "kbNdx0yqbZE",
    name: "Outra música",
    artist: "Outro artista",
    image: "/src/img/music/song-2.jpg",
  },
  {
    audio: "icBDYkfxpMs",
    name: "Terceira música",
    artist: "Outro artista",
    image: "/src/img/music/song-3.jpg",
  },
  {
    audio: "19y8YTbvri8",
    name: "Quarta música",
    artist: "Artista",
    image: "/src/img/music/song-4.jpg",
  },
  {
    audio: "3iUgKH8c7p4",
    name: "Quinta música",
    artist: "Artista",
    image: "/src/img/music/song-5.jpg",
  },
];

let currentSongIndex = 0;
let player = null;
let playerReady = false;
let isSeeking = false;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    width: "0",
    height: "0",
    videoId: songs[currentSongIndex].audio,

    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1,
    },

    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

songSlider.addEventListener("pointerdown", function () {
  isSeeking = true;
});

songSlider.addEventListener("input", function () {
  if (!playerReady) {
    return;
  }

  player.seekTo(Number(songSlider.value), true);
});

songSlider.addEventListener("pointerup", function () {
  isSeeking = false;
});

function onPlayerReady(event) {
  playerReady = true;

  event.target.setVolume(10);

  updateSong();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    playpauseButton.classList.remove("fa-circle-play");
    playpauseButton.classList.add("fa-circle-pause");
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    playpauseButton.classList.remove("fa-circle-pause");
    playpauseButton.classList.add("fa-circle-play");
  }

  if (event.data === YT.PlayerState.ENDED) {
    if (currentSongIndex < songs.length - 1) {
      currentSongIndex++;
      updateSong();
    } else {
      currentSongIndex = 0;
      updateSong();
    }
  }
}

prevSongButton.addEventListener("click", function () {
  if (!playerReady) {
    return;
  }

  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  updateSong();
});

nextSongButton.addEventListener("click", function () {
  if (!playerReady) {
    return;
  }

  currentSongIndex++;

  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }

  updateSong();
});

playpauseButton.addEventListener("click", function () {
  if (!playerReady) {
    return;
  }

  const state = player.getPlayerState();

  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

function updateSong() {
  const song = songs[currentSongIndex];

  songSlider.value = 0;

  songImage.src = song.image;
  songName.innerText = song.name;
  songArtist.innerText = song.artist;

  if (playerReady) {
    player.loadVideoById(song.audio);
  }
}

function moveSlider() {
  if (!playerReady || isSeeking) {
    return;
  }

  const duration = player.getDuration();

  if (duration > 0) {
    songSlider.max = duration;
    songSlider.value = player.getCurrentTime();
  }
}

setInterval(moveSlider, 1000);
