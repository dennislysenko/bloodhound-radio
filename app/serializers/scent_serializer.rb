class ScentSerializer < ActiveModel::Serializer
  attributes :id, :source_track, :tracks
  has_one :user
end
