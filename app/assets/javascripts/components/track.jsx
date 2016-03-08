var Track = React.createClass({
    getInitialState() {
        return {};
    },

    play() {
        //let audio = new Audio();
        //audio.src = this.props.track.stream_url + '?client_id=' + this.props.soundcloud_client_id;
        //audio.play();
        this.props.player.queue([this.props.track]);
        this.props.player.playFirst();
    },

    render() {
        return (
            <div className="card" onClick={() => this.props.onClick()}>
                <img src={this.props.track.artwork_url} />
                <span>{this.props.track.title}</span>
            </div>
        );
    }
});