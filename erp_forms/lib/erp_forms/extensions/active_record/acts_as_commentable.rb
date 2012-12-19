module ErpForms
  module Extensions
    module ActiveRecord
      module ActsAsCommentable
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def acts_as_commentable
            has_many :comments, :as => :commented_record, :dependent => :destroy

            extend ActsAsCommentable::SingletonMethods
            include ActsAsCommentable::InstanceMethods
          end

        end

        module SingletonMethods
        end

        module InstanceMethods

          def add_comment(options={})
            self.comments.create(options)
          end

        end
      end #ActsAsCommentable
    end #ActiveRecord
  end #Extensions
end #Knitkit
