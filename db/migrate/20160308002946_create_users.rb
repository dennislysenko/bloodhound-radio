class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :soundcloud_id
      t.string :full_name
      t.string :username
      t.string :avatar_url
      t.string :soundcloud_url
      t.string :country
      t.string :city

      t.timestamps null: false
    end
  end
end
