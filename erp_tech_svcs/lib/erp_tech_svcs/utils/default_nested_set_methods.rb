module ErpTechSvcs
	module Utils
		module DefaultNestedSetMethods
			def self.included(base)
				base.extend(ClassMethods)
			end

			def to_label
				description
			end

			def leaf
			  children.size == 0
			end

			def to_json_with_leaf(options = {})
				self.to_json_without_leaf(options.merge(:methods => :leaf))
			end
			alias_method_chain :to_json, :leaf

      def to_tree_hash(options={})
        additional_values = options[:additional_values] || {}
        options[:additional_values] = additional_values.merge({
          :text => self.to_label,
          :leaf => self.leaf,
          :children => self.children.collect{|child| child.to_tree_hash(options)}
        })
        tree_hash = self.to_hash(options)
        tree_hash[:iconCls] = options[:icon_cls] if options[:icon_cls]
        tree_hash
      end

			module ClassMethods
				def find_roots
					where("parent_id = nil")
				end

				def find_children(parent_id = nil)
					parent_id.to_i == 0 ? self.roots : find(parent_id).children
				end
				
				# find_by_ancestor_iids
        # allows you to find a nested set element by the internal_identifiers in its ancestry
        # for example, to find a GlAccount whose internal_identifier is “site_4”, and whose parent’s internal_identifier is “nightly_room_charge”
        # and whose grandparent’s internal_identifier is “charge”, you would make this call:
        # gl_account = GlAccount.find_by_iids(['charge', 'nightly_room_charge', "site_4"])
        def find_by_ancestor_iids(iids)
          return nil unless iids.is_a? Array

          node = nil
          iids.each do |iid|
            if (iid == iids.first)
              node = where("parent_id is null and internal_identifier = ?",iid).first
            else
              node = where("parent_id = ? and internal_identifier = ?",node.id,iid).first
            end
            return nil if node.nil?
          end
          return node
        end
        
			end

		end #DefaultNestedSetMethods
	end #Utils
end #ErpTechSvcs

