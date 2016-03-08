class AddNameToScents < ActiveRecord::Migration
  def change
    add_column :scents, :name, :string
  end
end
