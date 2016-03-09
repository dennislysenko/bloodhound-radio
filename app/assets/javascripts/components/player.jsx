var Player = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        if (this.props.currentTrack == null) {
            return <div id="player">Nothing currently playing; select a scent to follow</div>;
        } else {
            let button;
            if (this.props.isPlaying) {
                // pause button
                button = <button onClick={this.props.onPause}>Pause</button>;
            } else {
                button = <button onClick={this.props.onResume}>Resume</button>;
            }

            let timer;
            if (this.props.currentTime >= 0) {
                let toReadableTime = (originalSeconds) => {

                    let hours = Math.floor(originalSeconds / 3600);
                    let leftover = originalSeconds - hours * 3600;
                    let minutes = Math.floor(leftover / 60);
                    let seconds = Math.floor(leftover % 60);

                    let zeroify = (i) => i < 10 ? `0${i}` : `${i}`;

                    if (hours > 0) {
                        return `${zeroify(hours)}:${zeroify(minutes)}:${zeroify(seconds)}`
                    } else {
                        return `${zeroify(minutes)}:${zeroify(seconds)}`
                    }
                };

                timer = <span>{toReadableTime(this.props.currentTime)} / {toReadableTime(this.props.currentTrack.duration / 1000)}</span>
            }

            return (
                <div id="player">
                    Playing <strong>{this.props.currentTrack.title}</strong>
                    {' '}
                    {timer}
                    {' '}
                    {button}
                    <button onClick={this.props.onSeed}>Seed</button>
                    <button onClick={this.props.onLike}>Like (on SoundCloud)</button>
                    <button onClick={this.props.onSkip}>Skip</button>
                </div>
            );
        }
    }
});