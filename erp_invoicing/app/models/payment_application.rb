class PaymentApplication < ActiveRecord::Base

  belongs_to :financial_txn
  belongs_to :payment_applied_to, :polymorphic => true
  belongs_to :money, :foreign_key => 'applied_money_amount_id', :dependent => :destroy

  before_destroy :unapply_payment

  def is_pending?
    (self.financial_txn.is_scheduled? or self.financial_txn.is_pending?) unless self.financial_txn.nil?
  end

  def apply_payment
    #check the calculate balance strategy, if it includes payments then do nothing
    #if it doesn't include payments then update the balance on the model
    unless self.payment_applied_to.calculate_balance_strategy_type.nil?
      unless self.payment_applied_to.calculate_balance_strategy_type.iid =~ /payment/
        update_applied_to_balance(:debit)
      end
    else
      update_applied_to_balance(:debit)
    end
  end

  def unapply_payment
    #check the calculate balance strategy, if it includes payments then do nothing
    #if it doesn't include payments then update the balance on the model
    if self.payment_applied_to.respond_to? :calculate_balance_strategy_type
      if !self.payment_applied_to.calculate_balance_strategy_type.nil?
        if self.payment_applied_to.calculate_balance_strategy_type.iid !=~ /payment/ and !self.is_pending?
          update_applied_to_balance(:credit)
        end
      elsif !self.is_pending?
        update_applied_to_balance(:credit)
      end
    end
  end

  private

  def update_applied_to_balance(type)
    #check if payment_applied_to model has a balance= method
    if self.payment_applied_to.respond_to?(:balance=)
      if type == :debit
        self.payment_applied_to.balance = self.payment_applied_to.balance - self.money.amount
      else
        self.payment_applied_to.balance = self.payment_applied_to.balance + self.money.amount
      end
      self.payment_applied_to.save
    end
  end

end
