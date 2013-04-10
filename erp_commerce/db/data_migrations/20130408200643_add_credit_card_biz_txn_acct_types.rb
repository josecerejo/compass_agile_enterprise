class AddCreditCardBizTxnAcctTypes

  def self.up
    # add credit card account types as biz txn account types
    if (BizTxnAcctType.find_by_internal_identifier('credit_card_account').nil?)
      @credit_card_account = BizTxnAcctType.create(
          :description => 'Credit Card Account',
          :internal_identifier => 'credit_card_account',
      )
    end

    if (BizTxnAcctType.find_by_internal_identifier('amex').nil?)
      @type = BizTxnAcctType.create(
        :description => 'American Express',
        :internal_identifier => 'amex',
      )
      @type.move_to_child_of @credit_card_account
    end

    if (BizTxnAcctType.find_by_internal_identifier('dinersclub').nil?)
      @type = BizTxnAcctType.create(
          :description => 'Diners Club',
          :internal_identifier => 'dinersclub',
      )
      @type.move_to_child_of @credit_card_account
    end

    if (BizTxnAcctType.find_by_internal_identifier('discover').nil?)
      @type = BizTxnAcctType.create(
        :description => 'Discover',
        :internal_identifier => 'discover',
      )
      @type.move_to_child_of @credit_card_account
    end

    if (BizTxnAcctType.find_by_internal_identifier('mastercard').nil?)
      @type = BizTxnAcctType.create(
          :description => 'MasterCard',
          :internal_identifier => 'mastercard',
      )
      @type.move_to_child_of @credit_card_account
    end

    if (BizTxnAcctType.find_by_internal_identifier('visa').nil?)
      @type = BizTxnAcctType.create(
          :description => 'Visa',
          :internal_identifier => 'visa',
      )
      @type.move_to_child_of @credit_card_account
    end
  end

  def self.down
    #remove data here
  end

end
