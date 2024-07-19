=== DPA AI Assistant ===
Contributors: digistatejp
Tags: ai, gpt, openai, writer, image generator
Requires at least: 6.2
Tested up to: 6.6
Stable tag: 0.1.6
Requires PHP: 8.0
Donate link: https://dpapps.net/donation/
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI Content Generating Assistant - Content Writer, ChatGPT, Image Generator, Transcription and Fine-tune AI models.

== Description ==

DPA AI Assistant can generate articles and images by integrating with various generative AI services. It can also fine-tune AI models by utilizing datasets.

== Installation ==

1. From the WP admin panel, click "Plugins" -> "Add new".
2. In the browser input box, type "DPA AI Assistant".
3. Select the "DPA AI Assistant" plugin and click "Install".
4. Activate the plugin.

OR...

1. Download the plugin from this page.
2. Save the .zip file to a location on your computer.
3. Open the WP admin panel, and click "Plugins" -> "Add new".
4. Click "upload".. then browse to the .zip file downloaded from this page.
5. Click "Install".. and then "Activate plugin".

== Usage ==

1. Create an account at OpenAI and Stability AI.
2. Create API keys and insert in the plugin settings (DPAPPS -> AI Assistant -> Settings).
3. Enjoy the features of AI Assistant.
More details and documentation in [here](https://dpapps.net/docs/docs-ai-assistant/).

== Frequently Asked Questions ==

= What is the "DPA AI Assistant" plugin? =
"DPA AI Assistant" is a plugin that uses the power of GPT to help you create high-quality content for your website. This plugin also allows you to generate blog post ideas, write articles, and create entire pages in seconds.

== Screenshots ==

1. Chat screen
2. Image generation screen
3. Writer screen #1
4. Writer screen #2
5. Transcription screen (Text to Speech)
6. Transcription screen (Speech to text)
7. Fine-tuned model list
8. List of dataset files (jsonl) for Fine-tuning
9. Dataset creation (Easy mode)
10. Dataset creation (Expert mode)
11. Create a Fine-tuned model
12. Plugin options
13. Suggest title, excerpt, tags and featured image in editor

== Disclaimer ==

DPA AI Assistant is a plugin that helps you to connect your websites to AI services. You need your own API keys and must follow the rules set by the AI service you choose. Before using this plugin, please check their terms of use.

* OpenAI: [Terms of Service](https://openai.com/terms/), [Privacy Policy](https://openai.com/privacy/)
* Stability AI: [Terms of Service](https://platform.stability.ai/legal/terms-of-service), [Privacy Policy](https://stability.ai/privacy-policy)

Please do so with other services as well. Our privacy policy is [here](https://dpapps.net/privacy-policy/).

The developer of DPA AI Assistant and related parties are not responsible for any issues or losses caused by using the plugin or AI-generated content. You should talk to a legal expert and follow the laws and regulations of your country. DPA AI Assistant does only store data on your own server, and it is your responsibility to keep it safe.

== Upgrade notice ==

== For developers ==

The development hub for this plugin and the source code can be found at <a href="https://github.com/DigiPressApps/dpa-ai-assistant">https://github.com/DigiPressApps/dpa-ai-assistant</a>.

== Changelog ==

= 0.1.6 (2024/07/19) =
* Fix: Fixed a bug that caused values ​​to be unable to be passed to the props spread syntax due to the change from defaultProps to default parameters.
* Fix: Removed unnecessary custom components.

= 0.1.5 (2024/07/10) =
* Fix: Removed `defaultProps` (Deprecated in React 19).
* Fix: Removed unnecessary custom components.

= 0.1.4 (2024/07/04) =
* Fix: Removed `defaultProps` (Deprecated in React 19).
* Fix: Minor fixed for the next WordPress 6.6.

= 0.1.3 (2024/07/01) =
* Update: Update Japanese translation file for PHP (dpa-ai-assistant-ja.po).

= 0.1.2 (2024/06/28) =
* Update: Update readme.txt and README.md.
* Fix: Sanitize post data sent via REST API.
* Fix: Matched the text domain to plugin slug.

= 0.1.1 (2024/05/26) =
* Fix: Escaping text output.