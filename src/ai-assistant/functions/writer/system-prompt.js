export const SYSTEM_PROMPT = 'You are an excellent bot who writes SEO friendly articles. Respond only the answers to the commands directed to you.'
export const SYSTEM_PROMPT_FOR_JSON = 'You are a helpful assistant designed to output JSON.'
export const MESSAGE_PROMPT_TRANSLATE_ENGLISH = 'Translate the text delimited by triple quotes in English in JSON format. The response format: {"translated":"translated text"}'
export const MESSAGE_MAGIC_PROMPT = 'Suggest an interesting topic related to popular hobbies about "{HOBBY}". Include terminologies related to "{HOBBY}" in your topic and generate specific content. Respond only a topic.'
export const MAGIC_PROMPT_TOPICS = [
	"Traveling",
	"Camping",
	"Cooking",
	"Investing",
	"Programming",
	"Driving cars",
	"Playing football (soccer)",
	"Playing baseball",
	"Playing basketball",
	"Playing tennis",
	"Playing volleyball",
	"Interior design",
	"Furniture",
	"Blogging",
	"Reading books",
	"Dancing",
	"Singing",
	"Listening to music",
	"Playing musical instruments (piano, guitar etc.)",
	"Learning new languages",
	"Shopping",
	"Hiking",
	"Cycling",
	"Exercising",
	"Drawing",
	"Painting",
	"Playing computer games",
	"Baking",
	"Gardening",
	"Doing crafts (handmade)",
	"Embroidering",
	"Playing board games",
	"Walking",
	"Writing stories",
	"Fishing",
	"Photography",
	"Skydiving",
	"Skating",
	"Skiing",
	"Snowboarding",
	"Longboarding",
	"Surfing",
	"Yoga",
	"Designing clothing",
	"Graphic design",
	"Web design",
	"Making Lego sets",
	"Bonsai",
	"Makeup",
	"Car racing",
	"Home Improvement Ideas",
	"Scuba diving",
	"Golfing",
	"Gymnastics",
	"Martial arts",
	"Rock climbing"
]
export const MESSAGE_PROMPT_TITLE = 'Write an attractive title suitable for an article about "{TOPIC}". Must be between {TITLE_MIN} and {TITLE_MAX} characters. Do not wrap the title in parentheses etc., just return the title string.'
export const MESSAGE_PROMPT_SECTIONS = 'Write {SECTION_COUNT} consecutive headings for an article about "{TITLE}". Use Markdown for formatting. Heading level: {HEADING_LEVEL}. Each heading is between {SECTION_TITLE_MIN} and {SECTION_TITLE_MAX} characters.'
export const MESSAGE_PROMPT_CONTENT = 'Write a compelling and well-researched article about "{TITLE}". The article is organized by the following headings (Heading level: {HEADING_LEVEL}):\n\n{SECTIONS}\n\nWrite at least {PARAGRAPHS_PER_SECTION} paragraphs per heading. Use Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. If the content includes reviews, summarize them in a table or list along with the text.'
export const MESSAGW_PROMPT_CONTENT_INSERT_TOC = 'Insert a Table of Contents at the beginning of the article or after the introduction that corresponds to the number of headings.'
export const MESSAGE_PROMPT_CONTENT_AT_LEAST_WORDS = 'Write the article of at least {MIN_CONTENT_WORDS} words.'
export const MESSAGE_PROMPT_CONTENT_INTRO = 'Add an introduction (do not use markdown) prefixed by "===INTRO===".'
export const MESSAGE_PROMPT_CONTENT_OUTRO = 'Add a conclusion (do not use markdown) with a strong summary that ties together the key takeaways of the article prefixed by "===OUTRO===".'
export const MESSAGE_PROMPT_CONTENT_INCLUDE_KEYWORDS = 'Include the following keywords in the article: "{KEYWORDS_TO_INCLUDE}".'
export const MESSAGE_PROMPT_EXCERPT = 'Write an excerpt for an article about "{TITLE}". Must be between {EXCERPT_MIN} and {EXCERPT_MAX} characters.'
export const MESSAGE_PROMPT_TAGS = 'Generate five tags about "{TITLE}". Separate each tag with a comma.'