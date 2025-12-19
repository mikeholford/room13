class CreateEnquiries < ActiveRecord::Migration[8.0]
  def change
    create_table :enquiries do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :membership_type

      t.timestamps
    end
  end
end
