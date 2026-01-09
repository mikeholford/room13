# frozen_string_literal: true

namespace :membership do
  desc "Migrate 'standard' membership type to 'premium' in enquiries table"
  task migrate_standard_to_premium: :environment do
    puts "Migrating membership types from 'standard' to 'premium'..."

    # Update Enquiry records (stores membership_type as string)
    enquiry_count = Enquiry.where(membership_type: "standard").count
    if enquiry_count > 0
      Enquiry.where(membership_type: "standard").update_all(membership_type: "premium")
      puts "  Updated #{enquiry_count} enquiry record(s)"
    else
      puts "  No enquiry records to update"
    end

    # Note: Member model uses enum with integer backing (0 = premium, formerly 'standard')
    # Since the integer value stays the same, no migration needed for members table.
    # The enum name change from 'standard' to 'premium' is handled automatically.

    member_count = Member.premium.count
    puts "  #{member_count} member(s) are now recognized as 'premium' (no data change needed)"

    puts "Done!"
  end
end
