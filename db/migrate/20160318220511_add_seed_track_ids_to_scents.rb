class AddSeedTrackIdsToScents < ActiveRecord::Migration
  def change
    add_column :scents, :seed_track_ids, :text
  end
end
