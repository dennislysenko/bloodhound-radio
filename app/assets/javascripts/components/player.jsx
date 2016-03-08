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

            return (
                <div id="player">
                    Playing {this.props.currentTrack.title}
                    {button}
                </div>
            );
        }
    }
});