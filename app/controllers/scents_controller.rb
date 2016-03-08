class ScentsController < ApplicationController
  before_action :restrict_access
  skip_before_action :verify_authenticity_token

  def index
    scents = current_user.scents.map { |scent| ScentSerializer.new(scent, root: false, only: [:name, :id]).as_json }
    render json: { scents: scents }
  end

  def create
    track_id = params[:track_id].to_i
    render status: :not_found, nothing: true if track_id.zero?
    track_id = track_id.to_s

    source_track = EasySoundcloud.fetch_single_track(track_id, current_user)

    related_tracks = EasySoundcloud.client_for(current_user).get("/tracks/#{track_id}/related")
    related_tracks.each do |track|
      Rails.cache.write(track['id'], track)
    end
    related_tracks.select! do |track|
      track['streamable'].eql? true
    end

    scent = Scent.create(
        source_track_id: track_id,
        track_ids: related_tracks.map { |track| track['id'] },
        name: 'Scent of ' + source_track['title'],
        user: current_user
    )

    render json: ScentSerializer.new(scent, only: [:name, :id]).as_json
  end

  def show
    render json: ScentSerializer.new(Scent.find(params[:id])).as_json
  end

  def possible_tracks
    tracks = Rails.cache.fetch("sc/user/likes/#{current_user.id}", expires_in: 1.day) do
      client = EasySoundcloud.client_for(current_user)
      client.get('/me/favorites').as_json
    end

    render json: { tracks: tracks }
  end
end
