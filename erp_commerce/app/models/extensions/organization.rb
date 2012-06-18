Organization.class_eval do
  has_many :accepted_credit_cards, :dependent => :destroy

  def accepted_ccs_for_select
    #TODO fix model so the case statement below is no longer necessary
    accepted_credit_cards = self.accepted_credit_cards
    accepted_credit_cards_for_select = accepted_credit_cards.collect do |accepted_type|
      case accepted_type.card_type
      when "MC"
        ["Mastercard", accepted_type.card_type]
      when "VS"
        ["Visa", accepted_type.card_type]
      when "AM"
        ["American Express", accepted_type.card_type]
      when "DC"
        ["Discover", accepted_type.card_type]
      end
    end
  end
end

