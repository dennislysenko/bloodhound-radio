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
            <div onClick={() => this.props.onClick()}><img src={this.props.track.artwork_url} /> {this.props.track.title}</div>
        );
    }
});