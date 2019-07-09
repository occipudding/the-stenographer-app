class AddAncestryToNotes < ActiveRecord::Migration[5.2]
  def change
    add_column :notes, :ancestry, :string
    add_index :notes, :ancestry
  end
end
