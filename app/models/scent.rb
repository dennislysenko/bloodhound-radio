class Scent < ActiveRecord::Base
  belongs_to :user
  serialize :track_ids, Array

  def source_track
    EasySoundcloud.fetch_single_track(source_track_id, user)
  end

  def tracks
    tracks = Hash[track_ids.map { |id| [id, $redis.get(cache_key(id))] }]

    # load tracks that aren't cached from the SC API
    unloaded_ids = tracks.select { |id, track_info| track_info.nil? }.map { |id, track_info| id }
    unloaded_tracks = EasySoundcloud.client_for(user).get("/tracks?ids=#{unloaded_ids.join(',')}")
    unloaded_tracks.each do |track|
      tracks[track['id']] = track
      Rails.cache.write(cache_key(track['id']), track)
    end

    tracks.map { |id, track| track }
  end

  private
  def cache_key(track_id)
    EasySoundcloud.cache_key(track_id)
  end
end
