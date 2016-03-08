class AddSoundcloudOauthToUsers < ActiveRecord::Migration
  def change
    add_column :users, :soundcloud_token, :string
  end
end
