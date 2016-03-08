var TrackList = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        let trackComponents = this.props.tracks.map(track => <Track track={track} onClick={() => this.props.onClick(track)}/>);
        return (
            <div>
                {trackComponents}
            </div>
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
            paused: false
        };
    },

    componentDidMount() {
        this.serverRequests = [];

        this.serverRequests.push($.get('/scents', result => this.setState({ scents: result.scents })));
        this.serverRequests.push($.get('/scents/possible_tracks', result => this.setState({ likedTracks: result.tracks })));
    },

    componentWillUnmount() {
        this.serverRequests.each(request => request.abort());
        this.serverRequests = [];
    },

    queue(tracks) {
        this.state.queue = tracks;
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

    playScent(scent) {
        this.serverRequests.push($.get(`/scents/${scent.id}`, result => {
            this.queue(result.scent.tracks);
            this.playFirst();
        }));
    },

    createScentFromTrack(track) {
        $.post('/scents', { track_id: track.id }, result => {
            if (result.scent) {
                this.state.scents.push(result.scent);
                this.forceUpdate();
            } else {
                alert(`Error: ${result}`);
            }
        })
    },

    render() {
        if (this.state.mode == 'scents') {
            // <TrackList tracks={this.props.tracks} onUserPlayed={this.playFirst}/>
            let that = this;
            let scents = this.state.scents.map(function(scent) {
                let handler = function() {
                    that.playScent(scent);
                };

                return <div key={scent.id} onClick={handler}>{scent.name}</div>
            });

            return (
                <div>
                    <Player currentTrack={this.state.currentTrack} onPause={this.pause} onResume={this.resume} isPlaying={!this.state.paused} />
                    {scents}

                    <h3>Create some new scents from your likes:</h3>
                    <TrackList tracks={this.state.likedTracks} onClick={track => this.createScentFromTrack(track)}/>
                </div>
            )
        } else if (this.state.mode == 'scent') {
            // show tracks from scent
        }
    }
});