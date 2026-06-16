/**
 * Local OPhim API type reference derived from:
 * - https://ophim17.cc/api-document
 * - live responses from https://ophim1.com/v1/api/*
 *
 * This file is intentionally JSDoc-only so the current JavaScript codebase can
 * reuse type hints without migrating to TypeScript.
 */

/**
 * @typedef {Object} OphimTaxonomyItem
 * @property {string} [id]
 * @property {string} [_id]
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} OphimTmdbInfo
 * @property {string} [type]
 * @property {string|number} [id]
 * @property {number|null} [season]
 * @property {number} [vote_average]
 * @property {number} [vote_count]
 */

/**
 * @typedef {Object} OphimImdbInfo
 * @property {string} [id]
 * @property {number} [vote_average]
 * @property {number} [vote_count]
 */

/**
 * @typedef {Object} OphimEpisodeSource
 * @property {string} name
 * @property {string} slug
 * @property {string} [filename]
 * @property {string} [link_embed]
 * @property {string} [link_m3u8]
 */

/**
 * @typedef {Object} OphimEpisodeServer
 * @property {string} server_name
 * @property {boolean} [is_ai]
 * @property {OphimEpisodeSource[]} server_data
 */

/**
 * @typedef {Object} OphimMovieSummary
 * @property {OphimTmdbInfo} [tmdb]
 * @property {OphimImdbInfo} [imdb]
 * @property {{ time?: string }} [modified]
 * @property {string} [_id]
 * @property {string} name
 * @property {string} slug
 * @property {string} [origin_name]
 * @property {string[]} [alternative_names]
 * @property {string} [type]
 * @property {string} [thumb_url]
 * @property {string} [poster_url]
 * @property {boolean} [sub_docquyen]
 * @property {string} [time]
 * @property {string} [episode_current]
 * @property {string} [episode_total]
 * @property {string} [quality]
 * @property {string} [lang]
 * @property {number} [year]
 * @property {OphimTaxonomyItem[]} [category]
 * @property {OphimTaxonomyItem[]} [country]
 */

/**
 * @typedef {OphimMovieSummary & Object} OphimMovieDetail
 * @property {{ time?: string }} [created]
 * @property {string} [content]
 * @property {string} [status]
 * @property {boolean} [is_copyright]
 * @property {boolean} [chieurap]
 * @property {string} [trailer_url]
 * @property {string} [notify]
 * @property {string} [showtimes]
 * @property {number} [view]
 * @property {string[]} [actor]
 * @property {string[]} [director]
 * @property {OphimEpisodeServer[]} [episodes]
 * @property {string[]} [lang_key]
 */

/**
 * @typedef {Object} OphimPagination
 * @property {number} totalItems
 * @property {number} totalItemsPerPage
 * @property {number} currentPage
 * @property {number} [pageRanges]
 */

/**
 * @typedef {Object} OphimListParams
 * @property {string} [type_slug]
 * @property {string[]} [filterCategory]
 * @property {string[]} [filterCountry]
 * @property {string} [filterYear]
 * @property {string} [sortField]
 * @property {OphimPagination} [pagination]
 * @property {number} [itemsUpdateInDay]
 */

/**
 * @typedef {Object} OphimListData
 * @property {OphimMovieSummary[]} items
 * @property {OphimMovieSummary[]} [itemsSportsVideos]
 * @property {OphimListParams} [params]
 * @property {string} [type_list]
 * @property {string} [APP_DOMAIN_FRONTEND]
 * @property {string} [APP_DOMAIN_CDN_IMAGE]
 */

/**
 * @typedef {Object} OphimHomeResponse
 * @property {string} status
 * @property {string} message
 * @property {OphimListData} data
 */

/**
 * @typedef {Object} OphimMovieDetailResponse
 * @property {string} status
 * @property {string} message
 * @property {{
 *   seoOnPage?: Object,
 *   breadCrumb?: Array<Object>,
 *   params?: Object,
 *   item?: OphimMovieDetail,
 *   APP_DOMAIN_CDN_IMAGE?: string,
 * }} data
 */

/**
 * @typedef {Object} OphimTaxonomyResponse
 * @property {string} status
 * @property {string} message
 * @property {{ items: OphimTaxonomyItem[] }} data
 */

export const OPHIM_RESPONSE_NOTES = {
  baseUrl: "https://ophim1.com/v1/api",
  imageCdn: "https://img.ophim.live/uploads/movies/",
  notes: [
    "Most list endpoints return { status, message, data: { items, params, ... } }.",
    "Movie detail returns data.item with nested episodes per server.",
    "Taxonomy endpoints such as /the-loai and /quoc-gia return data.items.",
    "Image fields like thumb_url and poster_url are often relative filenames that must be joined with the CDN base URL.",
  ],
};
