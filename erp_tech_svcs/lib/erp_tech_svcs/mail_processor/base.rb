require 'mail'
require 'openssl'
require 'yaml'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

module ErpTechSvcs
  module MailProcessor
    class Base < ActionMailer::Base

      def receive
        #sould be overridden
      end

      class << self
        attr_accessor :config

        def configure
          @config = {}
        end

        def connect
          config = @config
          Mail.defaults do
            retriever_method :imap, :address => "imap.gmail.com",
                             :port => 993,
                             :user_name => 'website@tnsolutionsinc.com',
                             :password => 'server123',
                             :enable_ssl => true

            #retriever_method :imap,
            #                 :address => config['address'],
            #                 :port => config['port'],
            #                 :user_name => config['username'],
            #                 :password => config['password'],
            #                 :enable_ssl => config['enable_ssl']
          end
        end

        def check_mail
          self.configure
          self.connect
          Mail.find(:what => :all, :count => 5, :keys => 'UNSEEN', :order => :asc).each do |mail|
            self.send(:new).receive(mail)
          end
        end
      end

    end#Base
  end#MailProcessor
end#ErpTechSvcs