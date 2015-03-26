module Jekyll
   class RandomElementTag < Liquid::Tag
   
      def initialize(tag_name, max, tokens)
        super
        @max = max.to_i
      end
   
      def render(context)
        rand(@max).to_s
      end
   end
end

Liquid::Template.register_tag('random', RandomElementTag)
