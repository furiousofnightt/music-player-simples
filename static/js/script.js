document.addEventListener("DOMContentLoaded", () => {
    const genreDropdown = document.getElementById("genre-dropdown");
    const dropdownTrigger = genreDropdown.querySelector(".dropdown-trigger");
    const dropdownOptions = document.getElementById("genre-options");
    const selectedText = document.getElementById("selected-genre-text");

    const loadGenreButton = document.getElementById("load-genre");
    const playlistElement = document.getElementById("playlist");
    const currentSongDisplay = document.getElementById("current-song");
    const genreDisplay = document.getElementById("genre");
    const timeCurrent = document.getElementById("time-current");
    const timeDuration = document.getElementById("time-duration");
    const progressBar = document.getElementById("progress-bar");
    const playBtn = document.getElementById("play");
    const audioPlayer = new Audio();

    audioPlayer.preload = "auto";
    audioPlayer.volume = 1.0;

    let selectedGenre = "";
    let userSeeking = false;
    let currentDuration = 0;
    let currentIndex = 0;
    let currentPlaylist = [];

    // Custom Dropdown Logic
    dropdownTrigger.addEventListener("click", () => {
        dropdownOptions.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!genreDropdown.contains(e.target)) {
            dropdownOptions.classList.remove("show");
        }
    });

    const loadGenres = () => {
        fetch("/api/genres")
            .then(res => res.json())
            .then(({ data }) => {
                dropdownOptions.innerHTML = "";
                if (!data || Object.keys(data).length === 0) return;

                Object.keys(data).forEach((genre) => {
                    const li = document.createElement("li");
                    li.textContent = capitalize(genre);
                    li.dataset.value = genre;
                    li.addEventListener("click", () => {
                        selectedGenre = genre;
                        selectedText.textContent = li.textContent;
                        dropdownOptions.classList.remove("show");

                        // Highlight selected
                        dropdownOptions.querySelectorAll("li").forEach(el => el.classList.remove("selected"));
                        li.classList.add("selected");
                    });
                    dropdownOptions.appendChild(li);
                });
            });
    };

    const toggleShuffle = () => {
        fetch("/api/shuffle", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(({ success, data }) => {
                if (success) {
                    const shuffleBtn = document.getElementById("shuffle");
                    shuffleBtn.classList.toggle("active", data.shuffle_status);
                }
            });
    };

    const toggleRepeat = () => {
        fetch("/api/repeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(({ success, data }) => {
                if (success) {
                    const repeatBtn = document.getElementById("repeat");
                    repeatBtn.classList.toggle("active", data.repeat_status);
                    audioPlayer.loop = data.repeat_status;
                }
            });
    };

    const loadGenrePlaylist = () => {
        if (!selectedGenre) return;

        fetch("/api/select_genre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genre: selectedGenre }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                currentPlaylist = data.playlist;
                updatePlaylistDisplay(data.playlist, selectedGenre);
                currentIndex = 0;
            });
    };

    const updatePlaylistDisplay = (playlist, genre) => {
        genreDisplay.textContent = `Gênero: ${capitalize(genre)}`;
        playlistElement.innerHTML = "";

        if (!playlist.length) {
            currentSongDisplay.textContent = "Nenhuma música disponível.";
            timeCurrent.textContent = "00:00";
            timeDuration.textContent = "00:00";
            progressBar.value = 0;
            return;
        }

        playlist.forEach((song, index) => {
            const li = document.createElement("li");
            li.textContent = extractSongName(song);
            li.dataset.index = index;
            li.addEventListener("click", () => playSong(index));
            playlistElement.appendChild(li);
        });

        currentSongDisplay.textContent = "Pronto para tocar";
        progressBar.value = 0;
    };

    const playSong = (index) => {
        currentIndex = index;
        fetch("/api/play", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                const url = `/api/music/${encodeURIComponent(data.full_path)}`;
                audioPlayer.src = url;
                audioPlayer.play();
                currentSongDisplay.textContent = data.current_song;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                highlightCurrentSong();
            });
    };

    const highlightCurrentSong = () => {
        const items = playlistElement.querySelectorAll("li");
        items.forEach((li, idx) => {
            li.classList.toggle("playing", idx === currentIndex);
        });
    };

    const togglePlay = () => {
        if (audioPlayer.paused) {
            if (!audioPlayer.src && currentPlaylist.length > 0) {
                playSong(currentIndex);
            } else if (audioPlayer.src) {
                audioPlayer.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        } else {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    const stopSong = () => {
        fetch("/api/stop", { method: "POST" })
            .then(() => {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                currentSongDisplay.textContent = "Nenhuma música tocando";
                timeCurrent.textContent = "00:00";
                timeDuration.textContent = "00:00";
                progressBar.value = 0;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                highlightCurrentSong(-1);
            });
    };

    audioPlayer.addEventListener("playing", () => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    audioPlayer.addEventListener("pause", () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    audioPlayer.addEventListener("loadedmetadata", () => {
        currentDuration = audioPlayer.duration;
        progressBar.max = currentDuration;
        timeDuration.textContent = formatTime(currentDuration);
        updateProgressBar();
    });

    audioPlayer.addEventListener("timeupdate", () => {
        if (!userSeeking) updateProgressBar();
    });

    audioPlayer.addEventListener("ended", () => {
        const repeatActive = document.getElementById("repeat").classList.contains("active");
        if (repeatActive) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            document.getElementById("next").click();
        }
    });

    const updateProgressBar = () => {
        const currentTime = audioPlayer.currentTime;
        progressBar.value = currentTime;
        timeCurrent.textContent = formatTime(currentTime);
    };

    progressBar.addEventListener("input", () => {
        userSeeking = true;
        const time = Math.floor(progressBar.value);
        timeCurrent.textContent = formatTime(time);
    });

    progressBar.addEventListener("change", () => {
        const time = Math.floor(progressBar.value);
        audioPlayer.currentTime = time;
        userSeeking = false;
    });

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    const formatTime = seconds => {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    const extractSongName = path => path.split("/").pop().replace(/\.(mp3|wav|ogg|flac)$/i, "");

    playBtn.addEventListener("click", togglePlay);
    document.getElementById("stop").addEventListener("click", stopSong);
    document.getElementById("repeat").addEventListener("click", toggleRepeat);
    document.getElementById("shuffle").addEventListener("click", toggleShuffle);

    document.getElementById("next").addEventListener("click", () =>
        fetch("/api/next", { method: "POST" })
            .then(res => res.json())
            .then(({ data }) => {
                currentIndex = (currentIndex + 1) % currentPlaylist.length;
                const url = `/api/music/${encodeURIComponent(data.full_path)}`;
                audioPlayer.src = url;
                audioPlayer.play();
                currentSongDisplay.textContent = data.current_song;
                highlightCurrentSong();
            })
    );

    document.getElementById("prev").addEventListener("click", () =>
        fetch("/api/previous", { method: "POST" })
            .then(res => res.json())
            .then(({ data }) => {
                currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
                const url = `/api/music/${encodeURIComponent(data.full_path)}`;
                audioPlayer.src = url;
                audioPlayer.play();
                currentSongDisplay.textContent = data.current_song;
                highlightCurrentSong();
            })
    );

    loadGenreButton.addEventListener("click", loadGenrePlaylist);
    loadGenres();
});
