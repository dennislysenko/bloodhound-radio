class ScentSerializer < ActiveModel::Serializer
  attributes :id, :name, :source_track, :tracks
  has_one :user
end
