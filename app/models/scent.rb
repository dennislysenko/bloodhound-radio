class Scent < ActiveRecord::Base
  belongs_to :user
  serialize :track_ids, Array

  def source_track
    Rails.cache.fetch(redis_key(source_track_id)) do
      EasySoundcloud.client_for(user).get("/tracks/#{source_track_id}")
    end
  end

  def tracks
    tracks = Hash.zip[track_ids.map { |id| [id, $redis.get(redis_key(id))] }]

    # load tracks that aren't cached from the SC API
    unloaded_ids = tracks.select { |id, track_info| track_info.nil? }.map { |id, track_info| id }
    unloaded_tracks = EasySoundcloud.client_for(user).get("/tracks?ids=#{unloaded_ids.join(',')}")
    unloaded_tracks.each do |track|
      tracks[track['id']] = track
      $redis.set(redis_key(track['id']), track)
    end

    tracks
  end

  private
  def redis_key(track_id)
    "sc:track:#{track_id}"
  end
end
