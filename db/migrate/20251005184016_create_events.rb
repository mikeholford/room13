class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :name
      t.string :slug

      t.timestamps
    end
    add_index :events, :slug, unique: true
  end
end
