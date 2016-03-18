class EasySoundcloud
  def self.client_for(user)
    Soundcloud.new({
                                :client_id => ENV['SOUNDCLOUD_CLIENT_ID'],
                                :client_secret => ENV['SOUNDCLOUD_SECRET'],
                                :access_token => user.soundcloud_token
                            })
  end

  def self.fetch_single_track(track_id, user)
    Rails.cache.fetch(cache_key(track_id)) do
      EasySoundcloud.client_for(user).get("/tracks/#{track_id}").as_json
    end
  end

  def self.related_tracks_for(track_id, user)
    Rails.cache.fetch("#{EasySoundcloud.cache_key(track_id)}:related") do
      related_tracks = EasySoundcloud.client_for(user).get("/tracks/#{track_id}/related")[0..3]
      related_tracks.each do |track|
        Rails.cache.write(EasySoundcloud.cache_key(track['id']), track)
      end
      related_tracks.select do |track|
        track['streamable'].eql? true
      end
    end
  end

  def self.cache_key(track_id)
    "sc:track:#{track_id}"
  end
end