source "https://rubygems.org"

# Same Jekyll version and plugins that GitHub Pages builds with.
gem "github-pages", group: :jekyll_plugins

# Ruby 3+ no longer bundles webrick, which `jekyll serve` needs.
gem "webrick"

# Windows has no native zoneinfo files and needs a directory watcher.
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
  gem "wdm", "~> 0.1"
end
