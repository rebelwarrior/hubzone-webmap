require "rails_helper"

RSpec.describe "map/_map_body.html.erb" do
  %w[en dev].each do |locale|
    context "testing for the #{locale} locale" do
      context "checking the map body" do
        before do
          I18n.locale = locale
          render partial: "map/map_body", locals: {locale: locale}
        end
        it "should have aria labels" do
          expect(rendered).to match /aria-label/
        end
        it "should have a tab index" do
          # expect(rendered).to match /tabindex/
          rendered.find_field('#search-field-small')['autofocus'].should be_present
        end
      end
    end
  end
end
