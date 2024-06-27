export const SYSTEM_PROMPT_RANDOM ='You are a bot that creates questions to GPT. Generate only one interesting question and return only question phrase. Return a question in a different field than the previous question. There is no need for your instructions or explanations at the beginning or end of your response. Return only the question you generated.'
export const MESSAGE_PROMPT_CONTINUE = 'Your response got cut off, because you only have limited response space. Continue writing exactly where you left off. Do not repeat yourself. Start your response from your cut off, though use backticks where appropriate.'
export const MESSAGE_PROMPT_PARAGRAPH = 'Write a paragraph about the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only generated paragraph.'
export const MESSAGE_PROMPT_ARTICLE = 'Write an article about the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Include an introduction and conclusion in the article. Return only generated article text.'
export const MESSAGE_PROMPT_OPINION = 'Express your thoughts and opinions about the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only your opinion or impressions.'
export const MESSAGE_PROMPT_COUNTERARGUMENT = 'Provide a counterargument about the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only the text of the rebuttal.'
export const MESSAGE_PROMPT_SUMMARIZE = 'Summarize the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only generated summaries.'
export const MESSAGE_PROMPT_EXPAND = 'Expand the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only expanded statements.'
export const MESSAGE_PROMPT_SUGGEST_TITLE = 'Suggest a title for the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only a title you generated.'
export const MESSAGE_PROMPT_EXCERPT = 'Create an excerpt of the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nKeep the excerpt to around 100 characters. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only an excerpt you generated.'
export const MESSAGE_PROMPT_BULLETED_LIST = 'Summarize the text in bulleted list.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only the generated bulleted list.'
export const MESSAGE_PROMPT_REWRITE = 'Rewrite the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only the rewritten text.'
export const MESSAGE_PROMPT_CONCLUSION = 'Write the conclusion of the text delimited by triple quotes.\n\n"""{MESSAGE}"""\n\nUse Markdown for formatting. Include relevant statistics, examples, and quotes to support your arguments and engage the reader. Return only the conclusion.'
export const MESSAGE_PROMPT_TRANSLATE_JAPANESE = 'Translate the text delimited by triple quotes in Japanese.\n\n"""{MESSAGE}"""\n\nReturn only the translated text.'
export const MESSAGE_PROMPT_TRANSLATE_ENGLISH = 'Translate the text delimited by triple quotes in English.\n\n"""{MESSAGE}"""\n\nReturn only the translated text.'
export const MESSAGE_MAGIC_PROMPT = 'Generate some interesting question about "{TOPIC}". Include terminologies related to "{TOPIC}" in your question and generate specific question content. Return only a question.'
export const MAGIC_PROMPT_TOPICS = [
	"Space",
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