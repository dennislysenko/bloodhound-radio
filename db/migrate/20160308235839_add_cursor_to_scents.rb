class AddCursorToScents < ActiveRecord::Migration
  def change
    add_column :scents, :current_track_index, :integer
    add_column :scents, :current_track_time, :float
  end
end
