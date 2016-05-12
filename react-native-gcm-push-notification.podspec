require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |spec|
  spec.name         = 'react-native-gcm-push-notification'
  spec.version      = package["version"]
  spec.license      = package["licence"]
  spec.homepage     = 'https://github.com/emroot/react-native-gcm-push-notification'
  spec.summary      = package["description"]
  spec.author       = "Libin Lu"
  spec.source       = {
    :git => 'https://github.com/emroot/react-native-gcm-push-notification.git',
    :tag => spec.version
  }
  spec.source_files = 'RNGCM.{h,m}'
end
