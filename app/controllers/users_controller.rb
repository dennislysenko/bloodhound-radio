class UsersController < ApplicationController
  def authenticate
    @user = User.find_by(soundcloud_id: sc_user_info['id'])

    # pull some fields from soundcloud
    simple_fields = %w[full_name username avatar_url country city]
    advanced_fields = { soundcloud_id: :id, soundcloud_url: :permalink_url }

    fields = Hash[simple_fields.map { |field| [field, field] }].merge(advanced_fields)
    attributes = Hash[fields.map { |db_field, sc_field| [db_field, sc_user_info[sc_field.to_s]] }]
    attributes['soundcloud_token'] = auth_hash['credentials']['token']

    unless auth_hash['credentials']['expires'].eql? false # strict equality check
      render text: 'Looks like your access token expires. Please contact the administrator so he can build in appropriate code logic.'
    end

    if @user.nil?
      @user = User.create(attributes)
    else
      @user.update(attributes)
    end

    session[:user_id] = @user.id

    redirect_to '/'
  end

  def deauthenticate
    session[:user_id] = nil
    redirect_to '/'
  end

  private
  def auth_hash
    request.env['omniauth.auth']
  end

  def sc_user_info
    auth_hash['extra']['raw_info']
  end
end
