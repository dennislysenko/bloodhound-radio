class EasySoundcloud
  def self.client_for(user)
    Soundcloud.new({
                                :client_id => ENV['SOUNDCLOUD_CLIENT_ID'],
                                :client_secret => ENV['SOUNDCLOUD_SECRET'],
                                :access_token => user.soundcloud_token
                            })
  end
end