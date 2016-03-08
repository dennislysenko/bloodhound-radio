class WelcomeController < ApplicationController
  def index
    @current_user = current_user
    @logged_in = logged_in?
    @user_id = session[:user_id]

    if logged_in?
      # @tracks = Rails.cache.fetch("sc/user_likes/#{current_user.id}", expires_in: 1.day) do
        client = EasySoundcloud.client_for(current_user)
        @tracks = client.get('/me/favorites')
      # end
    end
  end
end
