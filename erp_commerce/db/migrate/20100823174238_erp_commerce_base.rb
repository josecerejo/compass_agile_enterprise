class ErpCommerceBase < ActiveRecord::Migration
  def self.up
    #fees
    unless table_exists?(:fees)
        create_table :fees do |t|
          t.references :fee_record, :polymorphic => true     
          t.references :money
          t.references :fee_type
          t.string     :description
          t.datetime   :start_date
          t.datetime   :end_date
          t.string     :external_identifier
          t.string     :external_id_source

          t.timestamps
        end

        add_index :fees, [:fee_record_id, :fee_record_type], :name => 'fee_record_idx'
        add_index :fees, :fee_type_id
        add_index :fees, :money_id
    end
    
    unless table_exists?(:fee_types)
        create_table :fee_types do |t|
          t.string :internal_identifier    
          t.string :description
          t.string :comments
          t.string :external_identifier
          t.string :external_id_source
          
          #these columns are required to support the behavior of the plugin 'awesome_nested_set'
          t.integer  	:parent_id
          t.integer  	:lft
          t.integer  	:rgt
          
          t.timestamps
        end
    end
    
    #pricing tables
    unless table_exists?(:price_component_types)
      create_table :price_component_types do |t|

        t.string      :description
        t.string      :internal_identifier
        t.string      :external_identifier
        t.string      :external_id_source

        t.timestamps
      end
    end

    unless table_exists?(:pricing_plans)
      create_table :pricing_plans do |t|

        t.string  :description
        t.string  :comments

        t.string 	:internal_identifier

        t.string 	:external_identifier
        t.string 	:external_id_source

        t.date    :from_date
        t.date    :thru_date

        #this is here as a placeholder for an 'interpreter' or 'rule' pattern
        t.string  :matching_rules
        #this is here as a placeholder for an 'interpreter' or 'rule' pattern
        t.string  :pricing_calculation

        #support for simple assignment of a single money amount
        t.boolean :is_simple_amount
        t.integer :currency_id
        t.decimal :money_amount, :precision => 8, :scale => 2

        t.timestamps
      end
    end

    unless table_exists?(:pricing_plan_components)
      create_table :pricing_plan_components do |t|

        t.integer :price_component_type_id
        t.string  :description
        t.string  :comments

        t.string 	:internal_identifier
        t.string 	:external_identifier
        t.string 	:external_id_source


        #this is here as a placeholder for an 'interpreter' or 'rule' pattern
        t.string  :matching_rules
        #this is here as a placeholder for an 'interpreter' or 'rule' pattern
        t.string  :pricing_calculation

        #support for simple assignment of a single money amount
        t.boolean :is_simple_amount
        t.integer :currency_id
        t.decimal :money_amount, :precision => 8, :scale => 2

        t.timestamps

      end
      add_index :pricing_plan_components, :price_component_type_id
    end

    unless table_exists?(:valid_price_plan_components)
      create_table :valid_price_plan_components do |t|

        t.references  :pricing_plan
        t.references  :pricing_plan_component

        t.timestamps

      end
      add_index :valid_price_plan_components, :pricing_plan_id
      add_index :valid_price_plan_components, :pricing_plan_component_id
    end

    unless table_exists?(:pricing_plan_assignments)
      create_table :pricing_plan_assignments do |t|

        t.references  :pricing_plan

        #support a polymorhic interface to the thing we want to price
        t.integer     :priceable_item_id
        t.string      :priceable_item_type

        t.integer     :priority

        t.timestamps

      end
      add_index :pricing_plan_assignments, :pricing_plan_id
      add_index :pricing_plan_assignments, [:priceable_item_id,:priceable_item_type], :name => 'priceable_item_idx'
    end
   
    unless table_exists?(:prices)
      create_table :prices do |t|
  
        t.string      :description
  
        #support a polymorhic interface to the thing that HAS BEEN priced
        t.integer     :priced_item_id
        t.string      :priced_item_type
  
        #refer to the pricing plan by which this price was calculated
        t.references  :pricing_plan
  
        t.references  :money
  
        t.timestamps

      end
      add_index :prices, :money_id
      add_index :prices, :pricing_plan_id
      add_index :prices, [:priced_item_id,:priced_item_type], :name => 'priced_item_idx'
    end

    unless table_exists?(:price_components)
      create_table :price_components do |t|

        t.string      :description
        t.references  :pricing_plan_component
        t.references  :price
        t.references  :money

        #polymorphic relationship
        t.integer :priced_component_id
        t.string  :priced_component_type

        t.timestamps

      end
      add_index :price_components, :money_id
      add_index :price_components, :pricing_plan_component_id
      add_index :price_components, :price_id
      add_index :price_components, [:priced_component_id,:priced_component_type], :name => 'priced_component_idx'
    end
    
    #payment tables
    unless table_exists?(:payments)
      create_table :payments do |t|

        t.column :success,             :boolean
        t.column :reference_number,    :string
        t.column :financial_txn_id,    :integer
        t.column :current_state,       :string
        t.column :authorization_code,  :string
        t.string :external_identifier
              
        t.timestamps
      end
        
      add_index :payments, :financial_txn_id
    end

    unless table_exists?(:payment_gateways)
      create_table :payment_gateways do |t|

        t.column :params,                      :string
        t.column :payment_gateway_action_id,   :integer
        t.column :payment_id,   :integer
        t.column :response,                    :string

        t.timestamps
      end
    end

    unless table_exists?(:payment_gateway_actions)
      create_table :payment_gateway_actions do |t|

        t.column :internal_identifier, :string
        t.column :description,         :string

        t.timestamps
      end
    end

    add_index :payment_gateway_actions, :internal_identifier
    
    #tables
    unless table_exists?(:credit_cards)
      create_table :credit_cards do |t|

        t.column :crypted_private_card_number,       :string
        t.column :expiration_month,                  :integer     
        t.column :expiration_year,                   :integer

        t.column :description,                       :string
        t.column :first_name_on_card,                :string
        t.column :last_name_on_card,                 :string
        t.column :card_type,                         :string

        t.column :postal_address_id,                 :integer
        t.column :credit_card_account_purpose_id,    :integer
        t.column :credit_card_token,                 :string

        t.timestamps
      end
    end
    
    unless table_exists?(:credit_card_accounts)
      create_table :credit_card_accounts do |t|

        t.timestamps
      end
    end
    
    unless table_exists?(:credit_card_account_party_roles)
      create_table :credit_card_account_party_roles do |t|
        t.column :credit_card_account_id, :integer
        t.column :role_type_id,           :integer
        t.column :party_id,               :integer
        t.column :credit_card_id,         :integer

        t.timestamps
      end

      add_index :credit_card_account_party_roles, :credit_card_account_id
      add_index :credit_card_account_party_roles, :role_type_id
      add_index :credit_card_account_party_roles, :party_id
      add_index :credit_card_account_party_roles, :credit_card_id
    end
      
    unless table_exists?(:credit_card_account_purposes)
      create_table :credit_card_account_purposes do |t|

        t.column  :parent_id,    :integer
        t.column  :lft,          :integer
        t.column  :rgt,          :integer

        #custom columns go here

        t.column  :description,         :string
        t.column  :comments,            :string

        t.column 	:internal_identifier, :string
        t.column 	:external_identifier, :string
        t.column 	:external_id_source, 	:string

        t.timestamps
      end
    end
    
    unless table_exists?(:accepted_credit_cards)
      create_table :accepted_credit_cards do |t|
      
        t.references :organization
        t.string :card_type
      
        t.timestamps
      end
    end

    unless table_exists?(:bank_account_types)
      create_table :bank_account_types do |t|
        t.string :description
        t.string :internal_identifier

        t.timestamps
      end
    end

    unless table_exists?(:bank_accounts)
      create_table :bank_accounts do |t|
        t.string :routing_number
        t.string :crypted_private_account_number
        t.string :name_on_account
        t.references :bank_account_type

        t.timestamps
      end

      add_index :bank_accounts, :bank_account_type_id, :name => 'bank_accounts_account_type_idx'
    end
    #end tables
      
    #columns
    unless columns(:order_txns).collect {|c| c.name}.include?('payment_gateway_txn_id')
      add_column :order_txns, :payment_gateway_txn_id, :string
    end
      
    unless columns(:order_txns).collect {|c| c.name}.include?('credit_card_id')
      add_column :order_txns, :credit_card_id, :integer
    end
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_first_name')
      add_column :order_txns, :bill_to_first_name, :string
    end
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_last_name')
      add_column :order_txns, :bill_to_last_name, :string
    end  
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_address_line_1')
      add_column :order_txns, :bill_to_address_line_1, :string
    end

    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_address_line_2')
      add_column :order_txns, :bill_to_address_line_2, :string
    end
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_city')
      add_column :order_txns, :bill_to_city, :string
    end   
     
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_state')
      add_column :order_txns, :bill_to_state, :string
    end
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_postal_code')
      add_column :order_txns, :bill_to_postal_code, :string
    end  
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_country')
      add_column :order_txns, :bill_to_country, :string
    end
    
    unless columns(:order_txns).collect {|c| c.name}.include?('bill_to_country_name')
  	  rename_column :order_txns, :bill_to_country, :bill_to_country_name
  	  rename_column :order_txns, :ship_to_country, :ship_to_country_name
      add_column :order_txns, :bill_to_country, :string
      add_column :order_txns, :ship_to_country, :string
    end
    #end
  end

  def self.down
    
    if columns(:order_txns).collect {|c| c.name}.include?('payment_gateway_txn_id')
      remove_column :order_txns, :payment_gateway_txn_id
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('credit_card_id')
      remove_column :order_txns, :credit_card_id, :integer
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_first_name')
      remove_column :order_txns, :bill_to_first_name, :string
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_last_name')
      remove_column :order_txns, :bill_to_last_name, :string
    end  
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_address')
      remove_column :order_txns, :bill_to_address, :string
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_city')
      remove_column :order_txns, :bill_to_city, :string
    end   
     
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_state')
      remove_column :order_txns, :bill_to_state, :string
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_postal_code')
      remove_column :order_txns, :bill_to_postal_code, :string
    end  
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_country')
      remove_column :order_txns, :bill_to_country, :string
    end
    
    if columns(:order_txns).collect {|c| c.name}.include?('bill_to_country_name')
  	  remove_column :order_txns, :bill_to_country, :bill_to_country_name
  	  remove_column :order_txns, :ship_to_country, :ship_to_country_name
    end
    
    #tables
    drop_tables = [
      :bank_account_types,
      :bank_accounts,
      :credit_cards, 
      :credit_card_accounts,  
      :credit_card_account_party_roles,
      :credit_card_account_purposes,
      :payments,
      :payment_gateways,
      :payment_gateway_actions,
      :pricing_plans,
      :pricing_plan_components,
      :valid_price_plan_components,  
      :pricing_plan_assignments,
      :prices,
      :price_components,
      :price_component_types,
      :fees,:fee_types
    ]
    drop_tables.each do |table|
      if table_exists?(table)
        drop_table table
      end
    end
    
  end
end
