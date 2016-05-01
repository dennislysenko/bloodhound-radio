# bloodhound-radio
"Pandora for Soundcloud": lets you create radio stations + playlists using Soundcloud's wonderful 'related tracks' algorithm. Stations are called 'scents' and you can create one from any of your liked tracks easily, or search for a track to create a scent from.

**The fun part**: while listening to a station, you can press 'seed' on any track, and it'll blend in some related tracks into the list of tracks you have yet to hear. It's really fun--try it out.

Currently accessible [here on Heroku](http://screc.herokuapp.com); expect it to move if I start developing this project more seriously.

# stack
Written in Rails and React using the fantastic [reactjs/react-rails](https://github.com/reactjs/react-rails) gem. Uses NPM inside the rails pipeline to hook into the ecosystem of NPM modules developed for React.

# prerequisites
- Make sure you have Ruby and bundler installed. If so, skip this step. If not, either install ruby through your system package manager (`brew`, `apt-get`, etc) or use [rvm.io](http://rvm.io/). Make sure `ruby -v` and `bundler -v` both return a version number. If ruby does but bundler doesn't, run `sudo gem install bundler` or follow instructions at [bundler.io](http://bundler.io/).

- Make sure you have Node.js installed. This is so we can use NPM to hook into the extensive ecosystem around React--no node server is used in this project.

I strongly suggest using RubyMine as an IDE; all frontend code is written in React with ES6 and JSX, which RubyMine supports strongly out of the box (as far as I know), and of course RubyMine supports Ruby on Rails nearly flawlessly. If you want to choose a different IDE or a non-IDE editor, bear in mind these things:

- Most of the frontend Javascript code is written using JSX, which allows you to mix HTML directly into Javascript (in a nutshell) like `var element = <p>Element</p>;`. 

- The Javascript in this project is compiled at an ECMAScript 6 language level, which has a lot of syntactical departures from plain Javascript: lambdas (`array.map(element => element.variable)`), template literals, etc.

# setup

1. Clone this repository: `git clone https://github.com/dennislysenko/bloodhound-radio`

1. Create a SoundCloud app using the [SoundCloud developer dashboard](http://soundcloud.com/you/apps).

1. Create a .env file with the following contents:

    ```
    SOUNDCLOUD_CLIENT_ID=YOUR_APP_CLIENT_ID
    SOUNDCLOUD_SECRET=YOUR_APP_SECRET
    REDIS_URL=redis://localhost:6379/0
    ```
    
    Naturally, you must replace the `YOUR_APP_*` placeholders there with the client ID and app secret that you got in step 1.

1. Install a redis server. Here is the [official guide](http://redis.io/topics/quickstart) on how to get quickly set up with Redis. (The server uses redis to cache track metadata to avoid making unnecessary API calls to SoundCloud.)

1. Run `bundle install` in the directory where you cloned the project to download all ruby dependencies.

1. Run `npm install` in the directory where you cloned the project to download all javascript dependencies.

1. Run `bundle exec rails server` to start the server and navigate to [localhost:3000](http://localhost:3000) in your browser.


# contributing
Feel free to fork and make changes. After you make a change, run through your code once more and make sure it's well documented. Make a pull request. I'll ask you to clean up your code if necessary. (Of course, what I wrote so far isn't stellar code structure, but now that it's public I need to start keeping it clean going forward.) 

Don't forget to use ES6 language features wherever appropriate, in line with the rest of the codebase.

As always, before making a huge change, please raise an issue so we can level about which files you should and shouldn't be touching and hopefully figure out a system where my development won't undercut yours. Significant contributions over time will of course make me consider making you a full-fledged collaborator.
