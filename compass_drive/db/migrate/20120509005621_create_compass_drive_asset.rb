class CreateCompassDriveAsset < ActiveRecord::Migration
  def up
    unless table_exists?(:compass_drive_assets)
      create_table :compass_drive_assets do |t|
        t.boolean    :checked_out
        t.references :checked_out_by
        t.datetime   :last_checkout_at
        t.string     :name

        t.timestamps
      end

      add_index :compass_drive_assets, :checked_out_by_id, :name => 'compass_drive_asset_checked_out_by_idx'
      add_index :compass_drive_assets, :checked_out, :name => 'compass_drive_asset_checked_out_idx'
    end

    unless table_exists?(:compass_drive_asset_versions)
      create_table :compass_drive_asset_versions do |t|
        t.references :compass_drive_asset
        t.references :file_asset
        t.references :checked_in_by
        t.text       :comment
        t.integer    :version

        t.timestamps
      end

      add_index :compass_drive_asset_versions, :compass_drive_asset_id
      add_index :compass_drive_asset_versions, :file_asset_id
      add_index :compass_drive_asset_versions, :checked_in_by_id
    end
  end

  def down
    if table_exists?(:compass_drive_assets)
      drop_table :compass_drive_assets
    end

    if table_exists?(:compass_drive_asset_versions)
      drop_table :compass_drive_asset_versions
    end
  end
end
