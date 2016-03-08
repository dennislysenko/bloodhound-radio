class CreateScents < ActiveRecord::Migration
  def change
    create_table :scents do |t|
      t.string :source_track_id
      t.text :track_ids

      t.timestamps null: false
    end
  end
end
