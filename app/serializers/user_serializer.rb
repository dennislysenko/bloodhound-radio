class UserSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :username, :city, :country
end
