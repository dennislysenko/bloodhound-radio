class ScentsController < ApplicationController
  before_action :restrict_access
  skip_before_action :verify_authenticity_token

  def index
    scents = current_user.scents.map { |scent| ScentSerializer.new(scent, root: false, only: [:name, :id, :source_track]).as_json }
    render json: { scents: scents }
  end

  def create
    track_id = params[:track_id].to_i
    render status: :not_found, nothing: true if track_id.zero?
    track_id = track_id.to_s

    source_track = EasySoundcloud.fetch_single_track(track_id, current_user)
    related_tracks = EasySoundcloud.related_tracks_for(track_id, current_user)

    scent = Scent.create(
        source_track_id: track_id,
        track_ids: related_tracks.map { |track| track['id'] },
        name: 'Scent of ' + source_track['title'],
        user: current_user
    )

    render json: ScentSerializer.new(scent, only: [:name, :id, :source_track]).as_json
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

  def like_track
    track_id = params[:track_id].to_i

    client = EasySoundcloud.client_for(current_user)
    client.put("/me/favorites/#{track_id}")

    tracks = client.get('/me/favorites').as_json
    Rails.cache.write("sc/user/likes/#{current_user.id}", tracks)

    render json: { liked_tracks: tracks }
  end

  def search
    client = EasySoundcloud.client_for(current_user)
    tracks = client.get("/tracks?q=#{Rack::Utils.escape params[:query]}").as_json

    render json: { tracks: tracks }
  end

  def seed
    scent = Scent.find(params[:id])
    tracks = EasySoundcloud.related_tracks_for(params[:track_id].to_i, current_user)
    scent.blend_track_ids!(tracks.map { |track| track['id'] })

    render json: { new_tracks: scent.tracks }
  end

  def update_cursor
    scent = Scent.find(params[:id])

    scent.update!(current_track_index: params[:current_track_index].to_i, current_track_time: params[:current_track_time].to_f)

    render json: { success: true }
  end
end
