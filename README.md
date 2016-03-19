# bloodhound-radio
"Pandora for Soundcloud": lets you create radio stations + playlists using Soundcloud's wonderful 'related tracks' algorithm. Stations are called 'scents' and you can create one from any of your liked tracks easily, or search for a track to create a scent from.

**The fun part**: while listening to a station, you can press 'seed' on any track, and it'll blend in some related tracks into the list of tracks you have yet to hear. It's really fun--try it out.

Currently accessible [here on Heroku](screc.herokuapp.com); expect it to move if I start developing this project more seriously.

# stack
Written in Rails and React using the fantastic [reactjs/react-rails](https://github.com/reactjs/react-rails) gem. 

# setup
Using RubyMine as an IDE is probably the quickest & easiest way to get set up on the development side; all frontend code is written in React with ES6 and JSX, which RubyMine supports strongly out of the box (as far as I know), and of course RubyMine supports Ruby on Rails nearly flawlessly.

The server does require a redis instance to run its caching code, so you'll have to either install redis or figure out how to disable caching (raise a github issue if necessary).

(TODO: add more helpful setup instructions 😂)

# contributing
Fork, make a pull request, and make sure your code is nice. I'll ask you to clean it up if not. What I wrote so far isn't great in terms of code quality, but now that it's public I need to start keeping some guidelines 😛
