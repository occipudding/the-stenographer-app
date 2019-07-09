class CreateTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :topics do |t|
      t.string :title
      t.references :user, foreign_key: true
      t.text :tags, default: [].to_yaml

      t.timestamps
    end
  end
end
