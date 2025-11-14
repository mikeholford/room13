class AddMembershipTypeAndTitleToMembers < ActiveRecord::Migration[8.0]
  def change
    add_column :members, :membership_type, :integer, default: 0, null: false
    add_column :members, :title, :string
    add_index :members, :membership_type
  end
end
