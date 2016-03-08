var TrackList = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        let trackComponents = this.props.tracks.map(track => <Track track={track} onUserPlayed={this.props.onUserPlayed}/>);
        return (
            <div>
                <h1>Track list</h1>
                {trackComponents}
            </div>
        )
    }
});

var Main = React.createClass({
    getInitialState() {
        return {
            mode: 'scents',
            audio: new Audio(),
            queue: this.props.tracks,
            currentTrack: null,
            paused: false
        };
    },

    queue(tracks) {
        this.state.queue = this.state.queue.concat(tracks);
    },

    playFirst() {
        this.state.currentTrack = this.state.queue.splice(0, 1)[0];

        this.state.audio.src = this.state.currentTrack.stream_url + '?client_id=' + this.props.soundcloud_client_id;
        this.state.audio.play();
        this.forceUpdate();
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

    render() {
        if (this.state.mode == 'scents') {
            return (
                <div>
                    <Player currentTrack={this.state.currentTrack} onPause={this.pause} onResume={this.resume} isPlaying={!this.state.paused} />
                    <TrackList tracks={this.props.tracks} onUserPlayed={this.playFirst}/>
                </div>
            )
        } else if (this.state.mode == 'scent') {
            // show tracks from scent
        }
    }
});