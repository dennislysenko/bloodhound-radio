class ScentSerializer < ActiveModel::Serializer
  attributes :id, :name, :source_track, :tracks, :current_track_index, :current_track_time
  has_one :user
end
