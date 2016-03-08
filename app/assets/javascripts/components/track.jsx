var Track = React.createClass({
    getInitialState() {
        return {};
    },

    play() {
        let audio = new Audio();
        audio.src = this.props.track.stream_url + '?client_id=' + this.props.soundcloud_client_id;
        audio.play();
    },

    render() {
        return (
            <div onClick={this.play}><img src={this.props.track.artwork_url} /> {this.props.track.title}</div>
        );
    }
});