module CompassDrive
  module MailProcessor
    class CompassDriveMailProcessor < ErpTechSvcs::MailProcessor::Base

      class << self
        def configure
          @config = YAML::load_file(File.join(Rails.root, 'config','compass_drive_mail_processor.yml'))[Rails.env]
        end
      end

      def receive(mail)
        unless mail.attachments.empty?
          user = User.find_by_email(mail.from.first)
          if !user.nil? #and mail.to.first =~ /compassdrive/
            category_name = mail.subject.split('::')
            if category_name.length == 1
              asset_name = category_name[0]
            else
              category_description = category_name[0]
              asset_name = category_name[1]
            end

            compass_drive_asset = CompassDriveAsset.find_by_name(asset_name)
            if compass_drive_asset.nil?
              compass_drive_asset = CompassDriveAsset.new(:name => asset_name)
              compass_drive_asset.add_file(mail.attachments.first, mail.parts[0].body.decoded, user)
              compass_drive_asset.categorize(Category.find_by_description(category_description)) if category_description
            else
              compass_drive_asset.add_file(mail.attachments.first, mail.parts[0].body.decoded)
            end

          end#make sure we have a user and this is addressed to compassdrive
        end#make sure there are some attachments
      end

    end #CompassDriveMailProcessor
  end #MailProcessor
end #CompassDrive