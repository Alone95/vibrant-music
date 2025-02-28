<template>
  <div id="app">
    <div class="video-wrapper">
      <video ref="videoPlayer" class="plyr"></video>
    </div>
    <div
      class="grey"
      v-show="playlist.showGrey !== undefined ? playlist.showGrey : true"
    ></div>
    <div class="stay-vibrant" v-show="!showInfo && clickPlay && !isMobile">
      <span @click="doShowInfo">LIFE IS FUN HAVE A NICE DAY</span>
    </div>
    <div class="info" v-show="showInfo || (isMobile && clickPlay)">
      <div class="top">
        <div class="title">LIFE IS FUN HAVE A NICE DAY</div>
        <div class="video-info">
          <div class="title link" @click="toYouTube">
            {{ playlist.title }}
          </div>
          <div class="subtitle">
            {{ playlist.subtitle }}
          </div>
        </div>
        <div class="menu">
          <div class="link">COLLECTED BY Alone95</div>
        </div>
      </div>
      <div class="bottom">
        <div>
          <div class="title link" @click="toYouTube">
            {{ playlist.title }}
          </div>
          <div class="subtitle">
            {{ playlist.subtitle }}
          </div>
        </div>
        <div class="controls">
          <div class="play" @click="playOrPause">
            {{ playButtonText }}
          </div>
          <div class="next" @click="nextPlaylist">
            NEXT
          </div>
        </div>
      </div>
    </div>
    <div class="play-button-layout" v-if="showStartButton">
      <div class="play-button" @click="startPlay">
        PLAY
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/plyr.css";
import Plyr from "plyr";
import playlists from "./playlists";

export default {
  name: "App",
  data() {
    return {
      player: null,
      showInfo: false,
      playlist: null,
      playingVideoID: null,
      timer: null,
      clickPlay: false,
      showStartButton: true,
      playButtonText: "PLAY",
      playedPlaylists: [],
      windowWidth: document.body.clientWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 768;
    },
  },
  created() {
    let playedPlaylistsInLocal = JSON.parse(
      localStorage.getItem("playedPlaylists")
    );
    if (playedPlaylistsInLocal !== null) {
      this.playedPlaylists = playedPlaylistsInLocal;
    }

    this.playlist = this.pickAUnplayedPlaylist();

    if (this.playedPlaylists.includes(this.playlist.title) === false) {
      this.playedPlaylists.push(this.playlist.title);
    }
  },
  mounted() {
    this.player = new Plyr(this.$refs.videoPlayer, {
      controls: [],
      youtube: {
        start: 1,
      },
    });
    this.nextVideo();
    this.player.on("ended", () => {
      this.nextVideo();
    });
    this.player.on("pause", () => {
      this.playButtonText = "PLAY";
    });
    this.player.on("playing", () => {
      this.playButtonText = "PAUSE";
    });
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = document.body.clientWidth;
    },
    startPlay() {
      this.clickPlay = true;
      this.player.play();
      this.player.autoplay = true;
      this.showStartButton = false;
    },
    playOrPause() {
      this.player.togglePlay();
    },
    doShowInfo() {
      this.showInfo = true;
      this.setShowInfoTimer();
    },
    setShowInfoTimer() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      if (!this.isMobile) {
        this.timer = setTimeout(() => {
          this.showInfo = false;
        }, 15000);
      }
    },
    pickAUnplayedPlaylist() {
      let availablePlaylists = playlists.filter((p) => {
        if (
          this.playedPlaylists.includes(p.title) === false &&
          p.title !== this.playlist?.title
        ) {
          return p;
        }
      });

      if (availablePlaylists.length !== 0) {
        let pickedPlaylist =
          availablePlaylists[
            Math.floor(Math.random() * availablePlaylists.length)
          ];
        this.playedPlaylists.push(pickedPlaylist.title);
        return pickedPlaylist;
      } else {
        this.playedPlaylists = [];
        return this.pickAUnplayedPlaylist();
      }
    },
    nextVideo() {
      this.playButtonText = "PLAY";
      this.setShowInfoTimer();
      let videoID = null;
      if (this.playingVideoID === null) {
        videoID = this.playlist.videos[0];
      } else {
        let currentIndex = this.playlist.videos.indexOf(this.playingVideoID);
        videoID = this.playlist.videos[currentIndex + 1];
        if (videoID === undefined) {
          this.nextPlaylist();
          return;
        }
      }
      this.playingVideoID = videoID;
      this.player.source = {
        type: "video",
        sources: [
          {
            src: videoID,
            provider: "youtube",
          },
        ],
      };
    },
    nextPlaylist() {
      this.playlist = this.pickAUnplayedPlaylist();
      this.playingVideoID = null;
      this.nextVideo();
    },
    toYouTube() {
      window.open(`https://www.youtube.com/watch/${this.playingVideoID}`);
    },
    toQier222() {
      window.open("https://github.com/qier222");
    },
  },
  watch: {
    playedPlaylists: function() {
      localStorage.setItem(
        "playedPlaylists",
        JSON.stringify(this.playedPlaylists)
      );
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

body {
  margin: 0;
  font-weight: 600;
  font-family: Inter, sans-serif;
}

.video-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.plyr {
  height: 100vh;
  z-index: 1;
}

.grey {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(160%) contrast(110%) brightness(104%);
  z-index: 1;
}

.plyr__video-embed iframe {
  top: -50%;
  height: 200%;
}

.stay-vibrant {
  color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  mix-blend-mode: difference;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 8rem;
  font-weight: 700;

  span {
    cursor: pointer;
  }
}

.info {
  color: #fff;
  position: fixed;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  mix-blend-mode: difference;
  z-index: 2;
  font-size: 18px;

  .link:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 32px 0 32px;
    .title {
      font-size: 64px;
      font-weight: 700;
    }
    .menu div {
      margin-right: 18px;
    }
    .video-info {
      display: none;
    }
  }

  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 32px 32px 32px;

    .title {
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 8px;
      margin-left: 4px;
    }
    .subtitle {
      font-size: 18px;
      font-weight: 600;
      margin-left: 4px;
    }
    .controls {
      display: flex;
      align-items: center;
      font-size: 24px;
      cursor: pointer;
      user-select: none;
      .play {
        margin-right: 48px;
        transition: all 0.4s;
        &:hover {
          letter-spacing: 2px;
        }
      }
      .next {
        margin-right: 24px;
        transition: all 0.4s;
        &:hover {
          letter-spacing: 2px;
        }
      }
    }
  }
}

.play-button-layout {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 200;

  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: difference;
  color: #fff;

  .play-button {
    cursor: pointer;
    font-size: 8rem;
    font-weight: 700;
    transition: all 0.6s;
    letter-spacing: 4px;
    &:hover {
      letter-spacing: 16px;
    }
  }
}

@media (max-width: 1200px) {
  .plyr {
    width: calc(100vh / 9 * 16);
    margin-left: calc((100vh / 9 * 16 - 100vw) / -2);
    max-width: unset;
  }
}

@media (max-width: 768px) {
  .plyr {
    width: calc(100vh / 9 * 16);
    margin-left: calc((100vh / 9 * 16 - 100vw) / -2);
    max-width: unset;
  }

  .stay-vibrant {
    font-size: 4rem;
    text-align: center;
  }

  .info {
    .top {
      flex-direction: column;
      align-items: flex-start;
      .title {
        font-size: 3rem;
      }
      .menu {
        margin-top: 6px;
        font-size: 0.6rem;
        opacity: 0.28;
      }
      .video-info {
        margin-top: -4px;
        display: block;
        .title {
          font-size: 2.2rem;
        }
        .subtitle {
          margin-top: 3px;
          font-size: 1.4rem;
        }
      }
    }
    .bottom {
      flex-direction: column;
      .title {
        font-size: 1.4rem;
        display: none;
      }
      .subtitle {
        font-size: 1rem;
        display: none;
      }
      .controls {
        margin-bottom: 24px;
        font-size: 1.2rem;
        justify-content: flex-start;
        text-align: center;
        width: 100%;
        .play {
          margin-right: 0;
          flex: 1;
        }
        .next {
          flex: 1;
          margin-right: 0;
        }
      }
    }
  }

  .play-button-layout .play-button {
    font-size: 6rem;
  }
}

@media (max-width: 414px) {
  .info .top {
    .title {
      font-size: 2.9rem;
    }
    .menu {
      font-size: 0.6rem;
    }
    .video-info {
      .title {
        font-size: 2.2rem;
      }
      .subtitle {
        font-size: 1.4rem;
      }
    }
  }

  .play-button-layout .play-button {
    font-size: 4rem;
  }
}

@media (max-width: 375px) {
  .info .top {
    .title {
      font-size: 2.6rem;
    }
    .menu {
      font-size: 0.6rem;
    }
    .video-info {
      .title {
        font-size: 1.8rem;
      }
      .subtitle {
        font-size: 1.3rem;
      }
    }
  }
}
@media (max-width: 360px) {
  .info .top .title {
    font-size: 2.1rem;
  }
}
</style>
