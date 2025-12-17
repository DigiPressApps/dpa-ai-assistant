import { __, sprintf } from "@wordpress/i18n";

// OpenAI URLs
export const OPEN_AI_API_KEY_URL = 'https://platform.openai.com/api-keys'
export const OPEN_AI_GPT_MODELS_URL = 'https://platform.openai.com/docs/models'
export const OPEN_AI_DALL_E_MODEL_DOCUMENT_URL = 'https://platform.openai.com/docs/guides/image-generation'
export const OPEN_AI_USAGE_URL = 'https://platform.openai.com/usage'
export const OPEN_AI_PRICING_URL = 'https://platform.openai.com/docs/pricing'

// Anthropic URLs
export const ANTHROPIC_API_KEY_URL = 'https://console.anthropic.com/settings/keys'
export const ANTHROPIC_GPT_MODEL_DOCUMENT_URL = 'https://docs.anthropic.com/ja/docs/models-overview'
export const ANTHROPIC_USAGE_URL = 'https://console.anthropic.com/settings/logs'
export const DEFAULT_ANTHROPIC_CLAUDE_MODEL = 'claude-3-haiku-20240307'
export const DEFAULT_ANTHROPIC_MAX_TOKENS = 2000
export const DEFAULT_ANTHROPIC_TEMPERATURE = 0.8

// StabilityAI URLs
export const STABILITY_AI_API_KEY_URL = 'https://platform.stability.ai/account/keys'
export const STABILITY_AI_MODEL_DOCUMENT_URL = 'https://platform.stability.ai/docs/legacy/grpc-api/features/api-parameters#engine'
export const STABILITY_AI_CALCULATE_COSTS_URL = 'https://platform.stability.ai/pricing'
export const STABILITY_AI_CREDITS_URL = 'https://platform.stability.ai/account/credits'

//OpenAI デフォルト
export const DEFAULT_OPEN_AI_GPT_MODEL = 'gpt-5-nano'
export const DEFAULT_OPEN_AI_MAX_TOKENS = 128000
export const DEFAULT_OPEN_AI_TEMPERATURE = 1.0
export const DEFAULT_OPEN_AI_TOP_P = 0.8
export const DEFAULT_OPEN_AI_DALL_E_MODEL = 'gpt-image-1-mini'
export const DEFAULT_OPEN_AI_DALL_E_NUMBER_IMAGES = 1
export const DEFAULT_OPEN_AI_DALL_E_IMAGE_SIZE = '1024x1024'
export const DEFAULT_OPEN_AI_DALL_E_QUALITY = 'auto'
export const DEFAULT_OPEN_AI_DALL_E_STYLE = 'vivid'

// Open AI モデル
export const OPEN_AI_GPT_MODELS = [
	{
		name: 'GPT-5.2',
		key: 'gpt-5.2',
		__experimentalHint: `${ __( 'The best model for coding and agentic tasks across industries', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $1.75/$14)`
	},
	{
		name: 'GPT-5.1',
		key: 'gpt-5.1',
		__experimentalHint: `${ __( 'The best model for coding and agentic tasks with configurable reasoning effort', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $1.25/$10)`
	},
	{
		name: 'GPT-5 nano',
		key: 'gpt-5-nano',
		__experimentalHint: `${ __( 'Fastest, most cost-efficient version of GPT-5', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.05/$0.40)`
	},
	{
		name: 'GPT-5 mini',
		key: 'gpt-5-mini',
		__experimentalHint: `${ __( 'A faster, cost-efficient version of GPT-5 for well-defined tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.25/$2.00)`
	},
	{
		name: 'GPT-5',
		key: 'gpt-5',
		__experimentalHint: `${ __( 'The best model for coding and agentic tasks across domains', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $1.25/$10.00)`
	},
	{
		name: 'GPT-4.1 nano',
		key: 'gpt-4.1-nano',
		__experimentalHint: `${ __( 'Fastest, most cost-effective GPT-4.1 model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.10/$0.40)`
	},
	{
		name: 'GPT-4.1 mini',
		key: 'gpt-4.1-mini',
		__experimentalHint: `${ __( 'Balanced for intelligence, speed, and cost', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.40/$1.60)`
	},
	{
		name: 'GPT-4o mini',
		key: 'gpt-4o-mini',
		__experimentalHint: `${ __( 'Fast, affordable small model for focused tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.15/$0.60)`
	},
	{
		name: 'GPT-4o mini Search Preview',
		key: 'gpt-4o-mini-search-preview',
		__experimentalHint: `${ __( 'Fast, affordable small model for web search', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.15/$0.60)`
	},
	{
		name: 'GPT-4o Search Preview',
		key: 'gpt-4o-search-preview',
		__experimentalHint: `${ __( 'GPT model for web search in Chat Completions', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.50/$10.00)`
	},
	{
		name: 'GPT-4.1',
		key: 'gpt-4.1',
		__experimentalHint: `${ __( 'Flagship GPT model for complex tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.00/$8.00)`
	},
	{
		name: 'GPT-4o',
		key: 'gpt-4o',
		__experimentalHint: `${ __( 'Fast, intelligent, flexible GPT model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.50/$10.00)`
	},
	{
		name: 'o3 mini',
		key: 'o3-mini',
		__experimentalHint: `${ __( 'Fast, flexible, intelligent reasoning model', dpaa.i18n ) } (In/Out: $1.10/$4.40)`
	},
	{
		name: 'o4 mini',
		key: 'o4-mini',
		__experimentalHint: `${ __( 'Faster, more affordable reasoning model', dpaa.i18n ) } (In/Out: $1.10/$4.40)`
	},
	{
		name: 'o3',
		key: 'o3',
		__experimentalHint: `${ __( 'Our most powerful reasoning model', dpaa.i18n ) } (In/Out: $10/$40)`
	},
	{
		name: 'o1',
		key: 'o1',
		__experimentalHint: `${ __( 'Previous full o-series reasoning model', dpaa.i18n ) } (In/Out: $15/$60)`
	},
	{
		name: 'o1 pro',
		key: 'o1-pro',
		__experimentalHint: `${ __( 'Version of o1 with more compute for better responses', dpaa.i18n ) } (In/Out: $150/$600)`
	},
];

// 画像生成モデル
export const OPEN_AI_DALL_E_MODELS = [
	{
		name: 'GPT Image 1.5',
		key: 'gpt-image-1.5',
		__experimentalHint: `${ __( 'State-of-the-art image generation model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $5.00/$10.00 ${ __( 'per 1M tokens', dpaa.i18n ) })`
	},
	{
		name: 'GPT Image 1 Mini',
		key: 'gpt-image-1-mini',
		__experimentalHint: `${ __( 'A cost-efficient version of GPT Image 1', dpaa.i18n ) } (${ __( '1024x1024 px', dpaa.i18n ) }: $0.005 - $0.036)`
	},
	{
		name: 'GPT Image 1',
		key: 'gpt-image-1',
		__experimentalHint: `${ __( 'Previous image generation model', dpaa.i18n ) } (${ __( '1024x1024 px', dpaa.i18n ) }: $0.011 - $0.167)`
	},
	{
		name: 'DALL·E 3',
		key: 'dall-e-3',
		__experimentalHint: `${ __( 'Previous generation image generation model', dpaa.i18n ) } (${ __( '1024x1024 px', dpaa.i18n ) }: $0.04 - $0.08)`
	},
	{
		name: 'DALL·E 2',
		key: 'dall-e-2',
		__experimentalHint: `${ __( 'Our first image generation model', dpaa.i18n ) } (${ __( '1024x1024 px', dpaa.i18n ) }: $0.02)`
	},
]
export const OPEN_AI_DALL_E_2_IMAGE_SIZES = [
	{ label: '256 x 256', value: '256x256' },
	{ label: '512 x 512', value: '512x512' },
	{ label: '1024 x 1024', value: '1024x1024' },
]
export const OPEN_AI_DALL_E_3_IMAGE_SIZES = [
	{ label: '1024 x 1024', value: '1024x1024' },
	{ label: '1792 x 1024', value: '1792x1024' },
	{ label: '1024 x 1792', value: '1024x1792' },
]
export const OPEN_AI_GPT_IMAGE_1_IMAGE_SIZES = [
	{ label: __( 'Auto', dpaa.i18n ), value: 'auto' },
	{ label: '1024 x 1024', value: '1024x1024' },
	{ label: '1536 x 1024', value: '1536x1024' },
	{ label: '1024 x 1536', value: '1024x1536' },
]
export const OPEN_AI_DALL_E_3_IMAGE_QUALITY = [
	{ label: __( 'Auto', dpaa.i18n ), value: 'auto' },
	{ label: __( 'Standard', dpaa.i18n ), value: 'standard' },
	{ label: __( 'HD', dpaa.i18n ), value: 'hd' },
]
export const OPEN_AI_GPT_IMAGE_1_IMAGE_QUALITY = [
	{ label: __( 'Auto', dpaa.i18n ), value: 'auto' },
	{ label: __( 'Low', dpaa.i18n ), value: 'low' },
	{ label: __( 'Medium', dpaa.i18n ), value: 'medium' },
	{ label: __( 'High', dpaa.i18n ), value: 'high' },
]
export const OPEN_AI_DALL_E_IMAGE_STYLES = [
	{ label: __( 'Vivid', dpaa.i18n ), value: 'vivid' },
	{ label: __( 'Natural', dpaa.i18n ), value: 'natural' },
]

// アシスタント用
export const OPEN_AI_GPT_ASSISTANTS_MODELS = [
	{
		name: 'GPT-4.1 nano',
		key: 'gpt-4.1-nano',
		__experimentalHint: `${ __( 'Fastest, most cost-effective GPT-4.1 model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.10/$0.40)`
	},
	{
		name: 'GPT-4o mini',
		key: 'gpt-4o-mini',
		__experimentalHint: `${ __( 'Fast, affordable small model for focused tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.15/$0.60)`
	},
	{
		name: 'GPT-4.1 mini',
		key: 'gpt-4.1-mini',
		__experimentalHint: `${ __( 'Balanced for intelligence, speed, and cost', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.40/$1.60)`
	},
	{
		name: 'GPT-4.1',
		key: 'gpt-4.1',
		__experimentalHint: `${ __( 'Flagship GPT model for complex tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.00/$8.00)`
	},
	{
		name: 'GPT-4o',
		key: 'gpt-4o',
		__experimentalHint: `${ __( 'Fast, intelligent, flexible GPT model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.50/$10.00)`
	},
	{
		name: 'o3-mini',
		key: 'o3-mini',
		__experimentalHint: `${ __( 'Fast, flexible, intelligent reasoning model', dpaa.i18n ) } (In/Out: $1.10/$4.40)`
	},
	{
		name: 'o1',
		key: 'o1',
		__experimentalHint: `${ __( 'Previous full o-series reasoning model', dpaa.i18n ) } (In/Out: $15/$60)`
	},
];

// Fine-tuning用のモデル
export const OPEN_AI_MODELS_FOR_FINE_TUNING = [
	{
		name: 'GPT-4o mini',
		key: 'gpt-4o-mini',
		__experimentalHint: `${ __( 'Fast, affordable small model for focused tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.15/$0.60)`
	},
	{
		name: 'GPT-4o',
		key: 'gpt-4o',
		__experimentalHint: `${ __( 'Fast, intelligent, flexible GPT model', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.50/$10.00)`
	},
	{
		name: 'GPT-4.1 mini',
		key: 'gpt-4.1-mini',
		__experimentalHint: `${ __( 'Balanced for intelligence, speed, and cost', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $0.40/$1.60)`
	},
	{
		name: 'GPT-4.1',
		key: 'gpt-4.1',
		__experimentalHint: `${ __( 'Flagship GPT model for complex tasks', dpaa.i18n ) } (${ __( 'In/Out', dpaa.i18n ) }: $2.00/$8.00)`
	},
];

// Claude models
export const ANTHROPIC_CLAUDE_MODELS = [
	{
		name: 'Claude 3.5 Sonnet',
		key: 'claude-3-5-sonnet-20240620',
		__experimentalHint: sprintf( __( '%s tokens', dpaa.i18n ), '8,192' ),
	},
	{
		name: 'Claude 3 Opus',
		key: 'claude-3-opus-20240229',
		__experimentalHint: sprintf( __( '%s tokens', dpaa.i18n ), '4,096' ),
	},
	{
		name: 'Claude 3 Sonnet',
		key: 'claude-3-sonnet-20240229',
		__experimentalHint: sprintf( __( '%s tokens', dpaa.i18n ), '4,096' ),
	},
	{
		name: 'Claude 3 Haiku',
		key: 'claude-3-haiku-20240307',
		__experimentalHint: sprintf( __( '%s tokens', dpaa.i18n ), '4,096' ),
	},
];

// チャット設定
export const CHAT_LANGUAGES = [
	// { value: 'auto', label: __( 'Auto', dpaa.i18n ) },
	{ value: 'de_DE', label: __( 'German', dpaa.i18n ) },
	{ value: 'en_US', label: __( 'English' ) },
	{ value: 'es_ES', label: __( 'Spanish', dpaa.i18n ) },
	{ value: 'fr_FR', label: __( 'French', dpaa.i18n ) },
	{ value: 'it_IT', label: __( 'Italian', dpaa.i18n ) },
	{ value: 'ja_JP', label: __( 'Japanese', dpaa.i18n ) },
	{ value: 'ko_KR', label: __( 'Korean', dpaa.i18n ) },
	{ value: 'nl_NL', label: __( 'Dutch', dpaa.i18n ) },
	{ value: 'nn_NO', label: __( 'Norwegian', dpaa.i18n ) },
	{ value: 'pl_PL', label: __( 'Polish', dpaa.i18n ) },
	{ value: 'pt_BR', label: sprintf( '%s (%s)', __( 'Portuguese', dpaa.i18n ), __( 'Brazil', dpaa.i18n ) ) },
	{ value: 'pt_PT', label: __( 'Portuguese', dpaa.i18n ) },
	{ value: 'sv_SE', label: __( 'Swedish', dpaa.i18n ) },
	{ value: 'zh_CN', label: __( 'Chinese (Simplified)', dpaa.i18n ) },
	{ value: 'zh_TW', label: __( 'Chinese (Traditional)', dpaa.i18n ) },
];
export const CHAT_CONTENT_STRUCTURES = [
	{ value: '', label: __( 'None', dpaa.i18n ) },
	{ value: 'analysis', label: __( 'Analysis', dpaa.i18n ) },
	{ value: 'article', label: __( 'Article', dpaa.i18n ) },
	{ value: 'case-study', label: __( 'Case-study', dpaa.i18n ) },
	{ value: 'email', label: __( 'Email', dpaa.i18n ) },
	{ value: 'faq', label: __( 'FAQ', dpaa.i18n ) },
	{ value: 'guide', label: __( 'Guide', dpaa.i18n ) },
	{ value: 'how-to', label: __( 'How-to', dpaa.i18n ) },
	{ value: 'interviews', label: __( 'Interviews', dpaa.i18n ) },
	{ value: 'opinion', label: __( 'Opinion', dpaa.i18n ) },
	{ value: 'pros-and-cons', label: __( 'Pros and Cons', dpaa.i18n ) },
	{ value: 'review', label: __( 'Review', dpaa.i18n ) },
	{ value: 'social-media-post', label: __( 'Social Media Post', dpaa.i18n ) },
	{ value: 'table', label: __( 'Table', dpaa.i18n ) },
	{ value: 'topic-wise', label: __( 'Topic-wise', dpaa.i18n ) },
	{ value: 'tutorial', label: __( 'Tutorial', dpaa.i18n ) },
];
export const CHAT_WRITING_STYLES = [
	{ value: 'normal', label: __( 'Normal', dpaa.i18n ) },
	{ value: 'business', label: __( 'Business', dpaa.i18n ) },
	{ value: 'creative', label: __( 'Creative', dpaa.i18n ) },
	{ value: 'descriptive', label: __( 'Descriptive', dpaa.i18n ) },
	{ value: 'expository', label: __( 'Expository', dpaa.i18n ) },
	{ value: 'legal', label: __( 'Legal', dpaa.i18n ) },
	{ value: 'marketing', label: __( 'Marketing', dpaa.i18n ) },
	{ value: 'narrative', label: __( 'Narrative', dpaa.i18n ) },
	{ value: 'news', label: __( 'News', dpaa.i18n ) },
	{ value: 'reflective', label: __( 'Reflective', dpaa.i18n ) },
	{ value: 'persuasive', label: __( 'Persuasive', dpaa.i18n ) },
	{ value: 'instructional', label: __( 'Instructional', dpaa.i18n ) },
	{ value: 'technical', label: __( 'Technical', dpaa.i18n ) },
	{ value: 'personal', label: __( 'Personal', dpaa.i18n ) },
	{ value: 'travel', label: __( 'Travel', dpaa.i18n ) },
	{ value: 'recipe', label: __( 'Recipe', dpaa.i18n ) },
	{ value: 'poetic', label: __( 'Poetic', dpaa.i18n ) },
	{ value: 'satirical', label: __( 'Satirical', dpaa.i18n ) },
	{ value: 'formal', label: __( 'Formal', dpaa.i18n ) },
	{ value: 'casual', label: __( 'Casual', dpaa.i18n ) },
];
export const CHAT_WRITING_TONES = [
	{ value: 'normal', label: __( 'Normal', dpaa.i18n ) },
	{ value: 'informative', label: __( 'Informative', dpaa.i18n ) },
	{ value: 'professional', label: __( 'Professional', dpaa.i18n ) },
	{ value: 'approachable', label: __( 'Approachable', dpaa.i18n ) },
	{ value: 'confident', label: __( 'Confident', dpaa.i18n ) },
	{ value: 'enthusiastic', label: __( 'Enthusiastic', dpaa.i18n ) },
	{ value: 'casual', label: __( 'Casual', dpaa.i18n ) },
	{ value: 'respectful', label: __( 'Respectful', dpaa.i18n ) },
	{ value: 'sarcastic', label: __( 'Sarcastic', dpaa.i18n ) },
	{ value: 'serious', label: __( 'Serious', dpaa.i18n ) },
	{ value: 'thoughtful', label: __( 'Thoughtful', dpaa.i18n ) },
	{ value: 'witty', label: __( 'Witty', dpaa.i18n ) },
	{ value: 'passionate', label: __( 'Passionate', dpaa.i18n ) },
	{ value: 'lighthearted', label: __( 'Lighthearted', dpaa.i18n ) },
	{ value: 'hilarious', label: __( 'Hilarious', dpaa.i18n ) },
	{ value: 'soothing', label: __( 'Soothing', dpaa.i18n ) },
	{ value: 'emotional', label: __( 'Emotional', dpaa.i18n ) },
	{ value: 'inspirational', label: __( 'Inspirational', dpaa.i18n ) },
	{ value: 'objective', label: __( 'Objective', dpaa.i18n ) },
	{ value: 'persuasive', label: __( 'Persuasive', dpaa.i18n ) },
	{ value: 'vivid', label: __( 'Vivid', dpaa.i18n ) },
	{ value: 'imaginative', label: __( 'Imaginative', dpaa.i18n ) },
	{ value: 'musical', label: __( 'Musical', dpaa.i18n ) },
	{ value: 'rhythmical', label: __( 'Rhythmical', dpaa.i18n ) },
	{ value: 'critical', label: __( 'Critical', dpaa.i18n ) },
	{ value: 'clearly', label: __( 'Clearly', dpaa.i18n ) },
	{ value: 'neutral', label: __( 'Neutral', dpaa.i18n ) },
	{ value: 'biased', label: __( 'Biased', dpaa.i18n ) },
	{ value: 'argumentative', label: __( 'Argumentative', dpaa.i18n ) },
	{ value: 'helpful', label: __( 'Helpful', dpaa.i18n ) },
	{ value: 'assertive', label: __( 'Assertive', dpaa.i18n ) },
	{ value: 'energetic', label: __( 'Energetic', dpaa.i18n ) },
	{ value: 'relaxed', label: __( 'Relaxed', dpaa.i18n ) },
	{ value: 'polite', label: __( 'Polite', dpaa.i18n ) },
	{ value: 'clever', label: __( 'Clever', dpaa.i18n ) },
	{ value: 'amusing', label: __( 'Amusing', dpaa.i18n ) },
	{ value: 'funny', label: __( 'Funny', dpaa.i18n ) },
	{ value: 'humorous', label: __( 'Humorous', dpaa.i18n ) },
	{ value: 'interesting', label: __( 'Interesting', dpaa.i18n ) },
];
export const DEFAULT_CHAT_LANGUAGE_CODE = 'auto'
export const DEFAULT_CHAT_WRITING_TONE = 'informative'
export const DEFAULT_CHAT_WRITING_STYLE = 'normal'
export const DEFAULT_CHAT_CONTENT_STRUCTURE = 'topic-wise'
export const DEFAULT_CHAT_MAX_CHAT_LOGS = 4
export const DEFAULT_CHAT_MAX_VISIBLE_CHAT_LOGS = 10

// Stability AI
export const STABILITY_AI_MODELS = [
	{
		name: 'Stable Diffusion v1.6',
		key: 'stable-diffusion-v1-6',
		__experimentalHint: sprintf( __( 'Credit: %s(Baseed on %s)', dpaa.i18n ), '0.2-1.0', '512x512px' ),
	},
	{
		name: 'Stable Diffusion XL v1.0',
		key: 'stable-diffusion-xl-1024-v1-0',
		__experimentalHint: sprintf( __( 'Credit: %s(Baseed on %s)', dpaa.i18n ), '0.2-0.6', '1024x1024px' ),
	},
];
export const STABILITY_AI_SDXL_1_0_IMAGE_SIZES = [
	{ label: '1024 x 1024', value: '1024x1024' },
	{ label: '1152 x 896', value: '1152x896' },
	{ label: '896 x 1152', value: '896x1152' },
	{ label: '1216 x 832', value: '1216x832' },
	{ label: '1344 x 768', value: '1344x768' },
	{ label: '768 x 1344', value: '768x1344' },
	{ label: '1536 x 640', value: '1536x640' },
	{ label: '640 x 1536', value: '640x1536' },
];
export const STABILITY_AI_SD_BETA_IMAGE_SIZES = [
	{ label: '1024 x 1024', value: '1024x1024' },
];
export const STABILITY_AI_STYLES = [
	{ label: __( 'None', dpaa.i18n ), value: 'none' },
	{ label: __( '3D Model', dpaa.i18n ), value: '3d-model' },
	{ label: __( 'Analog Film', dpaa.i18n ), value: 'analog-film' },
	{ label: __( 'Anime', dpaa.i18n ), value: 'anime' },
	{ label: __( 'Cinematic', dpaa.i18n ), value: 'cinematic' },
	{ label: __( 'Comic Book', dpaa.i18n ), value: 'comic-book' },
	{ label: __( 'Digital Art', dpaa.i18n ), value: 'digital-art' },
	{ label: __( 'Enhance', dpaa.i18n ), value: 'enhance' },
	{ label: __( 'Fantasy Art', dpaa.i18n ), value: 'fantasy-art' },
	{ label: __( 'Isometric', dpaa.i18n ), value: 'isometric' },
	{ label: __( 'Line Art', dpaa.i18n ), value: 'line-art' },
	{ label: __( 'Low Poly', dpaa.i18n ), value: 'low-poly' },
	{ label: __( 'Modeling Compound', dpaa.i18n ), value: 'modeling-compound' },
	{ label: __( 'Neon Punk', dpaa.i18n ), value: 'neon-punk' },
	{ label: __( 'Origami', dpaa.i18n ), value: 'origami' },
	{ label: __( 'Photographic', dpaa.i18n ), value: 'photographic' },
	{ label: __( 'Pixel Art', dpaa.i18n ), value: 'pixel-art' },
];
export const DEFAULT_STABILITY_AI_API_HOST = 'https://api.stability.ai'
export const DEFAULT_STABILITY_AI_API_VERSION = 'v1'
export const DEFAULT_STABILITY_AI_MODEL = 'stable-diffusion-xl-1024-v1-0'
export const DEFAULT_STABILITY_AI_TYPE = 'text-to-image'
export const DEFAULT_STABILITY_AI_STYLE = 'none'
export const DEFAULT_STABILITY_AI_WIDTH = 512
export const DEFAULT_STABILITY_AI_HEIGHT = 512
export const DEFAULT_STABILITY_AI_CFG_SCALE = 7
export const DEFAULT_STABILITY_AI_STEPS = 30
export const DEFAULT_STABILITY_AI_SAMPLES = 1

// ライター設定用(本文生成条件)
export const DEFAULT_WRITER_SECTION_COUNT = 3
export const DEFAULT_WRITER_PARAGRAPH_PER_SECTION = 3
export const DEFAULT_WRITER_SECTION_HEADING_LEVEL = '2'
export const DEFAULT_WRITER_TITLE_MIN_CHARACTERS = 40
export const DEFAULT_WRITER_TITLE_MAX_CHARACTERS = 60
export const DEFAULT_WRITER_SECTION_TITLE_MIN_CHARACTERS = 40
export const DEFAULT_WRITER_SECTION_TITLE_MAX_CHARACTERS = 60
export const DEFAULT_WRITER_EXCERPT_MIN_CHARACTERS = 100
export const DEFAULT_WRITER_EXCERPT_MAX_CHARACTERS = 180
export const DEFAULT_WRITER_MIN_CONTENT_WORDS = 800
// 見出し
export const DEFAULT_WRITER_IS_INSERT_TOC = false
export const DEFAULT_WRITER_IS_TOC_ORDERED_LIST = true
export const DEFAULT_WRITER_SHOW_TOC_TITLE = true
export const DEFAULT_WRITER_TOC_TITLE = __( 'Table of Contents', dpaa.i18n )
export const DEFAULT_WRITER_TOC_TITLE_TAG = 'h2'
// タグ
export const DEFAULT_WRITER_IS_GENERATE_TAGS = true
// イントロ
export const DEFAULT_WRITER_IS_INCLUDE_INTRO = true
export const DEFAULT_WRITER_SHOW_INTRO_TITLE = false
export const DEFAULT_WRITER_INTRO_TITLE = __( 'Introduction', dpaa.i18n )
export const DEFAULT_WRITER_INTRO_TITLE_TAG = 2
// まとめ
export const DEFAULT_WRITER_IS_INCLUDE_OUTRO = true
export const DEFAULT_WRITER_SHOW_OUTRO_TITLE = false
export const DEFAULT_WRITER_OUTRO_TITLE = __( 'Conclusion', dpaa.i18n )
export const DEFAULT_WRITER_OUTRO_TITLE_TAG = 2

// 画像生成条件
export const DEFAULT_WRITER_IS_GENERATE_FEATURED_IMAGE = false
export const DEFAULT_WRITER_IS_GENERATE_IMAGE_PER_SECTION = false

// 画像設定
export const DEFAULT_IMAGE_ENGINE = 'dall-e'
export const DEFAULT_UPLOAD_FILE_PREFIX = 'dpaa-'
export const DEFAULT_IMAGE_MAX_VISIBLE_IMAGE_LOGS = 4

// 音声変換
export const DEFAULT_OPEN_AI_SPEECH_MODEL = 'gpt-4o-mini-tts'
export const DEFAULT_OPEN_AI_SPEECH_VOICE = 'alloy'	// alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer
export const DEFAULT_OPEN_AI_SPEECH_FORMAT = 'mp3'	// mp3, opus, aac, flac, wav, and pcm
export const DEFAULT_OPEN_AI_SPEECH_SPEED = 1	// 0.25 to 4.0
export const DEFAULT_OPEN_AI_TRANSCRIPTION_MODEL = 'gpt-4o-mini-transcribe'	// gpt-4o-mini-transcribe
export const DEFAULT_OPEN_AI_TRANSCRIPTION_LANGUAGE = 'ja'	// ISO-639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const DEFAULT_OPEN_AI_TRANSCRIPTION_FORMAT = 'json'	// json, text, srt, verbose_json, or vtt
export const DEFAULT_OPEN_AI_TRANSCRIPTION_MAX_LOGS = 10
export const DEFAULT_OPEN_AI_TRANSCRIPTION_TEMPERATURE = 0	// 0.0 to 1.0
export const DEFAULT_OPEN_AI_SPEECH_MAX_LOGS = 10
export const OPEN_AI_TRANSCRIPTION_MODELS_DOCUMENT_URL = 'https://platform.openai.com/docs/guides/speech-to-text'
export const OPEN_AI_SPEECH_MODELS_DOCUMENT_URL = 'https://platform.openai.com/docs/guides/audio'
export const OPEN_AI_SPEECH_VOICES_URL = 'https://www.openai.fm/'
export const OPEN_AI_TRANSCRIPTION_MODELS = [
	{
		name: 'GPT-4o mini Transcribe',
		key: 'gpt-4o-mini-transcribe',
		__experimentalHint: `${ __( 'Speech-to-text model powered by GPT-4o mini', dpaa.i18n ) } (${ sprintf( __( '%s / minute', dpaa.i18n ), '$0.003' ) })`,
	},
	{
		name: 'GPT-4o Transcribe',
		key: 'gpt-4o-transcribe',
		__experimentalHint: `${ __( 'Speech-to-text model powered by GPT-4o', dpaa.i18n ) } (${ sprintf( __( '%s / minute', dpaa.i18n ), '$0.006' ) })`,
	},
	{
		name: 'Whisper',
		key: 'whisper-1',
		__experimentalHint: `${ __( 'General-purpose speech recognition model', dpaa.i18n ) } (${ sprintf( __( '%s / minute', dpaa.i18n ), '$0.006' ) })`,
	},
];
export const OPEN_AI_SPEECH_MODELS = [
	{
		name: 'GPT-4o mini TTS',
		key: 'gpt-4o-mini-tts',
		__experimentalHint: `${ __( 'Powered by GPT-4o mini', dpaa.i18n ) } (${ sprintf( __( '%s / minute', dpaa.i18n ), '$0.006' ) })`,
	},
	{
		name: 'Text-to-speech 1',
		key: 'tts-1',
		__experimentalHint: `${ __( 'Optimized for speed', dpaa.i18n ) } (${ sprintf( __( '%s / 1M characters', dpaa.i18n ), '$15.00' ) })`,
	},
	{
		name: 'Text-to-speech 1 HD',
		key: 'tts-1-hd',
		__experimentalHint: `${ __( 'Optimized for quality', dpaa.i18n ) } (${ sprintf( __( '%s / 1M characters', dpaa.i18n ), '$30.00' ) })`,
	},
];
export const OPEN_AI_SPEECH_VOICES = [
	{ label: __( 'Alloy', dpaa.i18n ), value: 'alloy' },
	{ label: __( 'Ash', dpaa.i18n ), value: 'ash' },
	{ label: __( 'Ballad', dpaa.i18n ), value: 'ballad' },
	{ label: __( 'Coral', dpaa.i18n ), value: 'coral' },
	{ label: __( 'Echo', dpaa.i18n ), value: 'echo' },
	{ label: __( 'Fable', dpaa.i18n ), value: 'fable' },
	{ label: __( 'Nova', dpaa.i18n ), value: 'nova' },
	{ label: __( 'Onyx', dpaa.i18n ), value: 'onyx' },
	{ label: __( 'Sage', dpaa.i18n ), value: 'sage' },
	{ label: __( 'Shimmer', dpaa.i18n ), value: 'shimmer' },
	{ label: __( 'Verse', dpaa.i18n ), value: 'verse' },
];
export const OPEN_AI_SPEECH_FORMATS = [
	{ label: __( 'MP3', dpaa.i18n ), value: 'mp3' },
	{ label: __( 'Opus', dpaa.i18n ), value: 'opus' },
	{ label: __( 'AAC', dpaa.i18n ), value: 'aac' },
	{ label: __( 'FLAC', dpaa.i18n ), value: 'flac' },
	{ label: __( 'WAV', dpaa.i18n ), value: 'wav' },
	{ label: __( 'PCM', dpaa.i18n ), value: 'pcm' },
];
export const OPEN_AI_TRANSCRIPTION_LANGUAGE = [
	{ label: __( 'None', dpaa.i18n ), value: '' },
	{ label: __( 'Japanese', dpaa.i18n ), value: 'ja' },
	{ label: __( 'English' ), value: 'en' },
	{ label: __( 'Spanish', dpaa.i18n ), value: 'es' },
	{ label: __( 'German', dpaa.i18n ), value: 'de' },
	{ label: __( 'Italian', dpaa.i18n ), value: 'it' },
	{ label: __( 'French', dpaa.i18n ), value: 'fr' },
	{ label: __( 'Dutch', dpaa.i18n ), value: 'nl' },
	{ label: __( 'Norwegian', dpaa.i18n ), value: 'no' },
	{ label: __( 'Polish', dpaa.i18n ), value: 'pl' },
	{ label: __( 'Portuguese', dpaa.i18n ), value: 'pt' },
	{ label: __( 'Swedish', dpaa.i18n ), value: 'sv' },
	{ label: __( 'Korean', dpaa.i18n ), value: 'ko' },
	{ label: __( 'Chinese', dpaa.i18n ), value: 'zh' },
];

export const TEXT_GENERATION_ENGINES = [
	{ value: 'gpt', label: __( 'GPT (OpenAI)', dpaa.i18n ) },
	{ value: 'gemini', label: __( 'Gemini (Google)', dpaa.i18n ) },
	// { value: 'claude', label: __( 'Claude (Anthropic)', dpaa.i18n ) },
];

export const IMAGE_GENERATION_ENGINES = [
	{ value: 'dall-e', label: __( 'OpenAI', dpaa.i18n ) },
	{ value: 'stable-diffusion', label: __( 'Stability AI', dpaa.i18n ) },
];

export const GOOGLE_AI_API_KEY_URL = 'https://aistudio.google.com/app/apikey'
export const GOOGLE_AI_GPT_MODEL_DOCUMENT_URL = 'https://ai.google.dev/gemini-api/docs/models/gemini'
export const  GOOGLE_AI_USAGE_URL = 'https://aistudio.google.com/app/plan_information'
// Gemini models
export const GOOGLE_AI_GEMINI_MODELS = [
	{
		name: 'Gemini 1.0 Pro',
		key: 'gemini-pro',
		__experimentalHint: __( 'Text' ),
	},
	{
		name: 'Gemini 1.0 Pro Vision',
		key: 'gemini-pro-vision',
		__experimentalHint: __( 'Text and Image', dpaa.i18n ),
	},
	{
		name: 'Gemini 1.5 Pro',
		key: 'gemini-1.5-pro-latest',
		__experimentalHint: __( 'Text, Image and Audio', dpaa.i18n ),
	},
];
export const DEFAULT_GOOGLE_AI_GEMINI_MODEL = 'gemini-pro'
export const DEFAULT_GOOGLE_AI_MAX_TOKENS = 2000
export const DEFAULT_GOOGLE_AI_TEMPERATURE = 0.8