class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :nickname
      t.string :email, null: false
      t.string :address_line_1
      t.string :address_line_2
      t.string :city
      t.string :state
      t.string :postal_code
      t.string :country
      t.string :occupation
      t.jsonb :additional_responses, default: {}
      t.integer :status, default: 0, null: false

      t.timestamps
    end
    
    add_index :members, :email, unique: true
    add_index :members, :status
  end
end
