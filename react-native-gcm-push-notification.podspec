require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |spec|
  spec.name         = 'react-native-gcm-push-notification'
  spec.version      = package["version"]
  spec.license      = package["license"]
  spec.homepage     = 'https://github.com/emroot/react-native-gcm-push-notification'
  spec.summary      = package["description"]
  spec.author       = "Libin Lu"
  spec.platform     = :ios, "8.0"
  spec.source       = {
    :git => 'https://github.com/emroot/react-native-gcm-push-notification.git',
    :tag => spec.version
  }
  spec.source_files = 'ios/RNGCM.{h,m}'
  spec.dependency 'Google/CloudMessaging'
  spec.dependency 'React'
end
