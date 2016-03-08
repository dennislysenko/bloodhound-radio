class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    User.find(session[:user_id].to_i)
  rescue => e
    nil
  end

  def logged_in?
    current_user.present?
  end

  def restrict_access
    render status: :forbidden, nothing: true unless logged_in?
  end
end
