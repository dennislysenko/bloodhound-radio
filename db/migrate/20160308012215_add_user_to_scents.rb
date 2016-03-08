class AddUserToScents < ActiveRecord::Migration
  def change
    add_reference :scents, :user, index: true, foreign_key: true
  end
end
