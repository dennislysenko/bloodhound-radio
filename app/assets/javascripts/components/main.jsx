var TrackList = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        let trackComponents = this.props.tracks.map(track => {
            if (this.props.compact) {
                return <div key={track.id} className="compact-track" onClick={() => this.props.onClick(track)}>
                    <img src={track.artwork_url} />
                    <div class="info">
                        <strong>{track.title}</strong>
                        {' '}
                        uploaded by
                        {' '}
                        <strong>{track.user.username}</strong>
                    </div>
                </div>;
            } else {
                return <Track key={track.id} track={track} onClick={() => this.props.onClick(track)}/>
            }
        });
        return (
            <div className="card-deck">{trackComponents}</div>
        )
    }
});

var Scent = React.createClass({
    render() {
        return <div onClick={this.playScent(scent)}>{scent.name}</div>
    }
});

var Main = React.createClass({
    getInitialState() {
        return {
            mode: 'scents',
            audio: new Audio(),
            queue: [],
            likedTracks: [],
            currentTrack: null,
            currentScent: null,
            scents: [],
            paused: false,
            serverRequests: [],
            searchText: "",
            searchResults: []
        };
    },

    runServerRequest(method, endpoint, data, callback) {
        let request;
        let decoratedCallback = (...args) => {
            let index = this.state.serverRequests.indexOf(request);
            if (index > -1) {
                this.state.serverRequests.splice(index, 1);
                this.forceUpdate();
            }
            callback(...args);
        };
        request = method.call(jQuery, endpoint, data, decoratedCallback);
        this.state.serverRequests.push(request);
        this.forceUpdate();
    },

    componentDidMount() {
        this.runServerRequest($.get, '/scents', null, result => this.setState({scents: result.scents}));
        this.runServerRequest($.get, '/scents/possible_tracks', null, result => this.setState({likedTracks: result.tracks}));

        $(this.state.audio).on('ended', () => this.nextTrack());
        $(this.state.audio).on('canplay', () => this.updatePlayer());
        this.playerUpdateInterval = setInterval(() => this.updatePlayer(), 100);
        this.serverUpdateInterval = setInterval(() => this.updateServer(), 5000);

        //this.serverRequests.push($.get('/scents', result => this.setState({ scents: result.scents })));
        //this.serverRequests.push($.get('/scents/possible_tracks', result => this.setState({ likedTracks: result.tracks })));
    },

    componentWillUnmount() {
        this.state.serverRequests.each(request => request.abort());
        this.state.serverRequests = [];
        if (this.playerUpdateInterval) {
            clearInterval(this.playerUpdateInterval);
        }
        if (this.serverUpdateInterval) {
            clearInterval(this.serverUpdateInterval);
        }
    },

    clearQueue() {
        this.state.queue = [];
        this.forceUpdate();
    },

    queue(tracks) {
        this.state.queue = tracks;// this.state.queue.concat(tracks);
        this.forceUpdate();
    },

    playFirst() {
        this.state.currentTrack = this.state.queue.splice(0, 1)[0];
        this.state.audio.src = this.state.currentTrack.stream_url + '?client_id=' + this.props.soundcloud_client_id;
        this.resume();
    },

    nextTrack() {
        this.playFirst();
    },

    pause() {
        this.state.audio.pause();
        this.state.paused = true;
        this.forceUpdate();
    },

    resume() {
        this.state.audio.play();
        this.state.paused = false;
        this.forceUpdate();
    },

    playScent(sourceScent) {
        this.runServerRequest($.get, `/scents/${sourceScent.id}`, null, result => {
            this.state.currentScent = result.scent;
            this.pause();
            this.clearQueue();
            this.queue(result.scent.tracks.slice(result.scent.current_track_index));
            this.playFirst();
            this.state.audio.currentTime = result.scent.current_track_time;
        });
    },

    createScentFromTrack(track) {
        this.runServerRequest($.post, '/scents', {track_id: track.id}, result => {
            if (result.scent) {
                this.state.scents.push(result.scent);
                this.forceUpdate();
            } else {
                alert(`Error: ${result}`);
            }
        });
    },

    seedWithCurrentTrack(track) {
        this.runServerRequest($.post, `/scents/${this.state.currentScent.id}/seed`, {track_id: track.id}, result => {
            if (result.new_tracks) {
                this.state.currentScent.tracks = this.state.currentScent.tracks.concat(result.new_tracks);
                this.queue(result.new_tracks);
            }
        })
    },

    likeCurrentTrack(track) {
        this.runServerRequest($.post, `/scents/like_track`, {track_id: track.id}, result => {
            this.setState({likedTracks: result.liked_tracks});
        })
    },

    updatePlayer() {
        // Right now just forces a re-render
        this.forceUpdate();
    },

    updateServer() {
        if (this.state.currentScent != null) {
            let currentTrackIndex = this.state.currentScent.tracks.indexOf(this.state.currentTrack);
            $.post(`/scents/${this.state.currentScent.id}/update_cursor`, {
                current_track_index: currentTrackIndex,
                current_track_time: this.state.audio.currentTime
            });
        }
    },

    changedSearchField(event) {
        this.setState({searchText: event.target.value});
        console.log(event.target.value);
    },

    search() {
        this.runServerRequest($.post, '/scents/search', {query: this.state.searchText}, result => this.setState({searchResults: result.tracks}))
    },

    render() {
        // <TrackList tracks={this.props.tracks} onUserPlayed={this.playFirst}/>
        let that = this;
        let scents = this.state.scents.map(function (scent) {
            let handler = function () {
                that.playScent(scent);
            };

            let className = "card";
            if (scent == that.state.currentScent) {
                className += " active";
            }

            return <div className={className} key={scent.id + className} onClick={handler}>
                <img src={scent.source_track.artwork_url}/>
                <span>{scent.name}</span>
            </div>
        });

        let loadingOverlay;
        if (this.state.serverRequests.length > 0) {
            loadingOverlay = <div id="overlay"><h1>Loading</h1></div>;
        }

        let scentsSection;
        if (scents.length > 0) {
            scentsSection = <div>
                <h3>Scents you're following:</h3>
                <div className="card-deck">
                    {scents}
                </div>
                <br />
            </div>
        }

        let mainDivClassName = "";
        let scentTracklistSection;
        if (this.state.currentScent != null) {
            mainDivClassName = "left";
            scentTracklistSection = <div className="right">
                <h3>Tracks on "{this.state.currentScent.name}"</h3>
                <TrackList tracks={this.state.currentScent.tracks} onClick={track => this.playTrackFromScent(track)}
                           compact/>
            </div>
        }

        return (
            <div>
                <div className={mainDivClassName}>
                    <Player currentTrack={this.state.currentTrack} onPause={this.pause} onResume={this.resume}
                            onSeed={this.seedWithCurrentTrack} onLike={track => this.likeCurrentTrack(track)}
                            onSkip={this.nextTrack} isPlaying={!this.state.paused}
                            currentTime={this.state.audio.currentTime} duration={this.state.audio.duration}/>

                    {scentsSection}

                    <h3>Search for a song:</h3>
                    <div className="center">
                        <input type="text" onChange={this.changedSearchField} placeholder="Type anything"/>
                        <button onClick={this.search}>Search</button>
                    </div>
                    <TrackList tracks={this.state.searchResults} onClick={track => this.createScentFromTrack(track)}/>

                    <h3>Give us a scent to track down from your likes:</h3>
                    <TrackList tracks={this.state.likedTracks} onClick={track => this.createScentFromTrack(track)}/>

                    {loadingOverlay}
                </div>

                {scentTracklistSection}
            </div>
        )
    }
});