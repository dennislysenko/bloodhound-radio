var TrackList = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        let trackComponents = this.props.tracks.map(track => <Track key={track.id} track={track}
                                                                    onClick={() => this.props.onClick(track)}/>);
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
            serverRequests: []
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

        //this.serverRequests.push($.get('/scents', result => this.setState({ scents: result.scents })));
        //this.serverRequests.push($.get('/scents/possible_tracks', result => this.setState({ likedTracks: result.tracks })));
    },

    componentWillUnmount() {
        this.state.serverRequests.each(request => request.abort());
        this.state.serverRequests = [];
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
        this.runServerRequest($.get, `/scents/${scent.id}`, null, result => {
            this.state.currentScent = scent;
            this.queue(result.scent.tracks);
            this.playFirst();
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

        let loading;
        if (this.state.serverRequests.length > 0) {
            loading = <div id="overlay"><h1>Loading</h1></div>;
        }

        return (
            <div>
                <Player currentTrack={this.state.currentTrack} onPause={this.pause} onResume={this.resume}
                        isPlaying={!this.state.paused}/>
                <div className="card-deck">
                    {scents}
                </div>

                <h3>Create some new scents from your likes:</h3>
                <TrackList tracks={this.state.likedTracks} onClick={track => this.createScentFromTrack(track)}/>

                {loading}
            </div>
        )
    }
});