class CreateNotes < ActiveRecord::Migration[5.2]
  def change
    create_table :notes do |t|
      t.text :content
      t.references :topic, foreign_key: true

      t.timestamps
    end
  end
end
