module RandomElement
  def random(input)
    rand(input.to_i).to_s
  end
end

Liquid::Template.register_filter(RandomElement)
