import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'mixpaneldevdocs/1.0.0 (api/5.0.4)');
  }
  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config) {
    this.core.setConfig(config);
  }
  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values) {
    this.core.setAuth(...values);
    return this;
  }
  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url, variables = {}) {
    this.core.setServer(url, variables);
  }
  /**
   * Send batches of events from your servers to Mixpanel.
   * ***
   * [block:api-header]
   * {
   *   "title": "Request Format"
   * }
   * [/block]
   * Each request ingests a batch of events into Mixpanel. We accept up to 2000 events and
   * 2MB uncompressed per request. Events are part of the request body. We support
   * Content-Type `application/json` or `application/x-ndjson`:
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "[\n  {\"event\": \"Signup\", \"properties\": {\"time\":
   * 1618716477000,\"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\"$insert_id\":
   * \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\"Referred by\": \"Friend\",\"URL\":
   * \"mixpanel.com/signup\"}},\n  {\"event\": \"Purchase\", \"properties\": {\"time\":
   * 1618716477000,\"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\"$insert_id\":
   * \"935d87b1-00cd-41b7-be34-b9d98dd08b42\",\"Item\": \"Coffee\", \"Amount\": 5.0}}\n]",
   *       "language": "json",
   *       "name": "JSON"
   *     },
   *     {
   *       "code": "{\"event\": \"Signup\", \"properties\": {\"time\":
   * 1618716477000,\"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\"$insert_id\":
   * \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\"Referred by\": \"Friend\",\"URL\":
   * \"mixpanel.com/signup\"}}\n{\"event\": \"Purchase\", \"properties\": {\"time\":
   * 1618716477000,\"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\"$insert_id\":
   * \"935d87b1-00cd-41b7-be34-b9d98dd08b42\",\"Item\": \"Coffee\", \"Amount\": 5.0}}\n",
   *       "language": "json",
   *       "name": "ndJSON"
   *     }
   *   ]
   * }
   * [/block]
   * We also support `Content-Encoding: gzip` to reduce network egress.
   * [block:api-header]
   * {
   *   "title": "Authentication"
   * }
   * [/block]
   * /import requires an Owner or Admin [Service Account](ref:service-accounts). project_id,
   * service account username and service account password are required to authenticate a
   * request.
   *
   * Note: /import also supports [Project Secret](ref:project-secret) for legacy reasons. If
   * you do not specify project_id, we will use secret auth.
   * [block:api-header]
   * {
   *   "title": "Validation"
   * }
   * [/block]
   * /import validates the supplied events and returns a 400 status code if _any_ of the
   * events fail validation with details of the error. If some events pass validation and
   * others fail, we will ingest the events that pass validation. When you encounter a 400
   * error in production, simply log the JSON response, as it will contain the `$insert_id`s
   * of the invalid events, which can be used to debug.
   *
   * ### High-level requirements
   *
   * - Each event must be properly formatted JSON.
   * - Each event must contain an event name, time, distinct_id, and $insert_id. These are
   * used to deduplicate events, so that this endpoint can be safely retried.
   * - Each event must be smaller than 1MB of uncompressed JSON.
   * - Each event must have fewer than 255 properties.
   * - All nested object properties must have fewer than 255 keys and max nesting depth is 3.
   * - All array properties must have fewer than 255 elements.
   *
   * ### Example of an event
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "{\n  \"event\": \"Signed up\",\n  \"properties\": {\n    \"time\":
   * 1618716477000,\n    \"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\n
   * \"$insert_id\": \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\n    \"ip\":
   * \"136.24.0.114\",\n    \"Referred by\": \"Friend\",\n    \"URL\":
   * \"mixpanel.com/signup\",\n  }\n}",
   *       "language": "json"
   *     }
   *   ]
   * }
   * [/block]
   *
   * ### event
   *
   * This is the name of the event. If you're loading data from a data warehouse, we
   * recommend using the name of the table as the name of the event.
   *
   * We recommend keeping the number of unique event names relatively small and using
   * properties for any variable context attached to the event. For example, instead of
   * tracking events with names "Paid Signup" and "Free Signup", we would recommend tracking
   * an event called "Signup" and having a property "Account Type" with value "paid" or
   * "free".
   *
   * ### **properties**
   *
   * This is a JSON object representing all the properties about the event. If you're loading
   * data from a data warehouse, we recommend using column names as the names of properties.
   *
   * ### properties.time
   *
   * The time at which the event occurred, in seconds or milliseconds since epoch. We require
   * a value for time. We will reject events with time values that are before 1971-01-01 or
   * more than 1 hour in the future as measured on our servers.
   *
   * ### properties.distinct_id
   *
   * distinct_id identifies the user who performed the event. distinct_id must be specified
   * on every event, as it is crucial for Mixpanel to perform behavioral analysis (unique
   * users, funnels, retention, cohorts) correctly and efficiently.
   *
   * If the event is not associated with any user, set distinct_id to the empty string.
   * Events with an empty distinct_id will be excluded from all behavioral analysis.
   *
   * To prevent accidental implementation mistakes, we disallow the following values for
   * distinct_id:
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "- 00000000-0000-0000-0000-000000000000\n- anon\n- anonymous\n- nil\n-
   * none\n- null\n- n/a\n- na\n- undefined\n- unknown\n- <nil>\n- 0\n- -1\n- true\n-
   * false\n- []\n- {}\n",
   *       "language": "text"
   *     }
   *   ]
   * }
   * [/block]
   *
   * ### properties.$insert_id
   *
   * We require that $insert_id be specified on every event. $insert_id provides a unique
   * identifier for the event, which we use for deduplication. Events with identical values
   * for (event, time, distinct_id, $insert_id) are considered duplicates and only one of
   * them will be surfaced in queries.
   *
   * $insert_ids must be ≤ 36 bytes and contain only alphanumeric characters or "-". We also
   * disallow any value for $insert_id from the list of invalid IDs provided for distinct_id
   * above.
   *
   * ### Example of a validation error
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "{\n  \"code\": 400,\n  \"error\": \"some data points in the request
   * failed validation\",\n  \"failed_records\": [\n    {\n      \"index\": 0,\n
   * \"$insert_id\": \"8a66058c-a56d-4ef6-8123-28b7c9f7e82f\",\n      \"field\":
   * \"properties.time\",\n      \"message\": \"properties.time' is invalid: must be
   * specified as seconds since epoch\"\n    },\n    {\n      \"index\": 3,\n
   * \"$insert_id\": \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\n      \"field\":
   * \"properties.utm_source\",\n      \"message\": \"properties.utm_source is invalid:
   * string should be valid utf8\"\n    },\n  ],\n  \"num_records_imported\": 23,\n
   * \"status\": \"Bad Request\"\n}",
   *       "language": "json"
   *     }
   *   ]
   * }
   * [/block]
   * When any single event in the batch does not pass validation, we return a 400 status code
   * and a response that looks like the above.
   *
   * `failed_records` includes one row for each of the failed events, with details about the
   * error we found. If some of the rows passed validation, we will ingest them and return
   * their count in `num_records_imported`.
   * [block:api-header]
   * {
   *   "title": "GeoIP Enrichment"
   * }
   * [/block]
   * If you supply a property `ip` with an IP address, Mixpanel will automatically do a GeoIP
   * lookup and replace the `ip` property with geographic properties (City, Country, Region).
   * These properties can be used in our UI to segment events geographically.
   *
   * This is an example of an event before and after enrichment:
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "{\n  \"event\": \"Signed up\",\n  \"properties\": {\n    \"time\":
   * 1618716477000,\n    \"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\n
   * \"$insert_id\": \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\n    \"ip\":
   * \"136.24.0.114\",\n    \"Referred by\": \"Friend\",\n    \"URL\":
   * \"mixpanel.com/signup\",\n  }\n}",
   *       "language": "json",
   *       "name": "Pre-Enrichment"
   *     },
   *     {
   *       "code": "{\n  \"event\": \"Signed up\",\n  \"properties\": {\n    \"time\":
   * 1618716477000,\n    \"distinct_id\": \"91304156-cafc-4673-a237-623d1129c801\",\n
   * \"$insert_id\": \"29fc2962-6d9c-455d-95ad-95b84f09b9e4\",\n    \"Referred by\":
   * \"Friend\",\n    \"URL\": \"mixpanel.com/signup\",\n    \"$city\": \"San Francisco\",\n
   *   \"$region\": \"California\",\n    \"mp_country_code\": \"US\"\n  }\n}",
   *       "language": "json",
   *       "name": "Post-Enrichment"
   *     }
   *   ]
   * }
   * [/block]
   *
   * [block:api-header]
   * {
   *   "title": "Rate Limits"
   * }
   * [/block]
   * To ensure real-time ingestion and quality-of-service, we have a rate limit of 2GB of
   * uncompressed JSON/minute or ~30k events per second, measured on a rolling 1 minute
   * basis.
   *
   * We recommend the following when it comes to sending data to our API at scale:
   *
   * * Send data as quickly as possible with concurrent clients until the server returns 429.
   * We see the best results with 10-20 concurrent clients sending 2K events per batch.
   * * When you see 429s, employ an [exponential backoff with
   * jitter](https://docs.aws.amazon.com/general/latest/gr/api-retries.html) strategy. We
   * recommend starting with a backoff of 2s and doubling backoff until 60s, with 1-5s of
   * jitter.
   * * We recommend gzip compression and using `Content-Encoding: gzip` to reduce network
   * egress and transfer time.
   * * In the rare event that our API returns a 502 or 503 status code, we recommend
   * employing the same exponential backoff strategy as with 429s.
   * * Please do not retry validation errors (400 status code), as they will consistently
   * fail and count toward the rate limit.
   *
   * *If you are an enterprise customer and require a higher limit for a 1-time backfill,
   * please reach out to your sales representative with your project_id and use-case.*
   * [block:api-header]
   * {
   *   "title": "Common Issues"
   * }
   * [/block]
   * $insert_id is required on all events. This makes it safe to retry /import requests. If
   * your events don't already have a unique ID (eg: a UUID/GUID), we recommend computing a
   * hash of some set of properties that make the event semantically unique (eg: distinct_id
   * + timestamp + some other property) and using the first 36 characters of that hash as the
   * $insert_id.
   *
   * We truncate all strings down to 255 characters. Here's what we recommend for the various
   * cases in which this typically happens:
   *
   * - URLs: We recommend parsing the URL and tracking its individual components (host, path,
   * url params) as properties. This is more useful in analysis, as you can segment events by
   * hostname or a particular URL parameter.
   * - JSON encoded strings: Sometimes a long string may be a JSON object encoded as a
   * string. We recommend parsing the JSON and flattening it into properties to send with the
   * event. This is similarly much more useful in analysis, as you can filter or breakdown by
   * any key within the JSON.
   * - Free text / user generated content: Some long fields may include full-text (eg: a
   * search term or a comment). If this property isn't useful for analysis, we recommend
   * excluding it from tracking to Mixpanel to avoid accidentally sending over any PII.
   * [block:api-header]
   * {
   *   "title": "Guides"
   * }
   * [/block]
   * See our Cloud Ingestion guides for example usage of this API to integrate with  [Google
   * Pub/Sub](doc:google-pubsub), [Amazon S3](doc:amazon-s3), or [Google Cloud
   * Storage](doc:gcs-import).
   *
   * @summary Import Events
   */
  importEvents(body, metadata) {
    return this.core.fetch('/import', 'post', body, metadata);
  }
  /**
   * Track events to Mixpanel from client devices. We recommend using one of our client-side
   * SDKs instead of using /track directly, as our SDKs provide queueing, retrying, batching,
   * and more.
   * ***
   * [block:api-header]
   * {
   *   "title": "When to use /track vs /import"
   * }
   * [/block]
   * Typically, we recommend using /import for server-side integrations as it is more
   * scalable and supports ingesting historical data. We only recommend /track for
   * client-side tracking in an environment for which we don't have SDK support or if you're
   * sending data via some other untrusted environment (eg: third-party webhooks that send
   * data to Mixpanel).
   * [block:parameters]
   * {
   *   "data": {
   *     "h-0": "",
   *     "h-1": "/track",
   *     "h-2": "/import",
   *     "0-0": "Events per request",
   *     "0-1": "50",
   *     "0-2": "2000",
   *     "1-0": "Authentication",
   *     "1-1": "Project Token, intended for untrusted clients.",
   *     "1-2": "Project Secret, intended for server-side integration.",
   *     "2-0": "Compression",
   *     "2-1": "None",
   *     "2-2": "Gzip allowed",
   *     "3-0": "Content-Type",
   *     "3-1": "application/x-www-form-urlencoded",
   *     "3-2": "application/json or application/x-ndjson",
   *     "4-0": "Ingesting historical events",
   *     "4-1": "Last 5 days only.",
   *     "4-2": "Any time after 1971-01-01."
   *   },
   *   "cols": 3,
   *   "rows": 5
   * }
   * [/block]
   *
   * [block:api-header]
   * {
   *   "title": "Limits"
   * }
   * [/block]
   * The limits for track are the same as /import, [see
   * here](https://developer.mixpanel.com/reference/import-events#rate-limits).
   *
   * @summary Track Events
   */
  trackEvent(body, metadata) {
    return this.core.fetch('/track', 'post', body, metadata);
  }
  /**
   * Takes a JSON object containing names and values of profile properties. If the profile
   * does not exist, it creates it with these properties. If it does exist, it sets the
   * properties to these values, overwriting existing values.
   *
   * @summary Set Property
   */
  profileSet(body, metadata) {
    return this.core.fetch('/engage#profile-set', 'post', body, metadata);
  }
  /**
   * Works just like "$set", except it will not overwrite existing property values. This is
   * useful for properties like "First login date".
   *
   * @summary Set Property Once
   */
  profileSetPropertyOnce(body, metadata) {
    return this.core.fetch('/engage#profile-set-once', 'post', body, metadata);
  }
  /**
   * Takes a JSON object containing keys and numerical values. $add will increment the value
   * of a user profile property. When processed, the property values are added to the
   * existing values of the properties on the profile. If the property is not present on the
   * profile, the value will be added to 0. It is possible to decrement by calling "$add"
   * with negative values. This is useful for maintaining the values of properties like
   * "Number of Logins" or "Files Uploaded".
   *
   * @summary Increment Numerical Property
   */
  profileNumericalAdd(body, metadata) {
    return this.core.fetch('/engage#profile-numerical-add', 'post', body, metadata);
  }
  /**
   * Adds the specified values to a list property on a user profile and ensures that those
   * values only appear once. The profile is created if it does not exist.
   *
   * @summary Union To List Property
   */
  userProfileUnion(body, metadata) {
    return this.core.fetch('/engage#profile-union', 'post', body, metadata);
  }
  /**
   * Takes a JSON object containing keys and values, and appends each to a list associated
   * with the corresponding property name. $appending to a property that doesn't exist will
   * result in assigning a list with one element to that property.
   *
   * @summary Append to List Property
   */
  profileAppendToListProperty(body, metadata) {
    return this.core.fetch('/engage#profile-list-append', 'post', body, metadata);
  }
  /**
   * Takes a JSON object containing keys and values. The value in the request is removed from
   * the existing list on the user profile. If it does not exist, no updates are made.
   *
   * @summary Remove from List Property
   */
  profileRemoveFromListProperty(body, metadata) {
    return this.core.fetch('/engage#profile-list-remove', 'post', body, metadata);
  }
  /**
   * Takes a JSON list of string property names, and permanently removes the properties and
   * their values from a profile.
   *
   * @summary Delete Property
   */
  profileDeleteProperty(body, metadata) {
    return this.core.fetch('/engage#profile-unset', 'post', body, metadata);
  }
  /**
   * Send a batch of profile updates. Instead of sending a single JSON object as the data
   * query parameter, send a JSON list of objects as the data parameter of an
   * application/json POST or GET request body
   *
   * @summary Update Multiple Profiles
   */
  profileBatchUpdate(body, metadata) {
    return this.core.fetch('/engage#profile-batch-update', 'post', body, metadata);
  }
  /**
   * Permanently delete the profile from Mixpanel, along with all of its properties. The
   * $delete object value is ignored - the profile is determined by the $distinct_id from the
   * request itself.
   *
   * If you have duplicate profiles, use property $ignore_alias set to true so that you don't
   * delete the original profile when trying to delete the duplicate (as they pass in the
   * alias as the distinct_id).
   *
   * @summary Delete Profile
   */
  deleteProfile(body, metadata) {
    return this.core.fetch('/engage#profile-delete', 'post', body, metadata);
  }
  /**
   * Updates or adds properties to a group profile. The profile is created if it does not
   * exist.
   *
   * @summary Update Property
   */
  groupSetProperty(body, metadata) {
    return this.core.fetch('/groups#group-set', 'post', body, metadata);
  }
  /**
   * Adds properties to a group only if the property is not already set. The profile is
   * created if it does not exist.
   *
   * @summary Set Property Once
   */
  groupSetPropertyOnce(body, metadata) {
    return this.core.fetch('/groups#group-set-once', 'post', body, metadata);
  }
  /**
   * Unsets specific properties on the group profile.
   *
   * @summary Delete Property
   */
  groupDeleteProperty(body, metadata) {
    return this.core.fetch('/groups#group-unset', 'post', body, metadata);
  }
  /**
   * Removes a specific value in a list property.
   *
   * @summary Remove from List Property
   */
  groupRemoveFromListProperty(body, metadata) {
    return this.core.fetch('/groups#group-remove-from-list', 'post', body, metadata);
  }
  /**
   * Adds the specified values to a list property on a group profile and ensures that those
   * values only appear once. The profile is created if it does not exist.
   *
   * @summary Union To List Property
   */
  groupUnion(body, metadata) {
    return this.core.fetch('/groups#group-union', 'post', body, metadata);
  }
  /**
   * Send a batch of group profile updates. Instead of sending a single JSON object as the
   * data query parameter, send a JSON list of objects as the data parameter of an
   * application/x-www-form-urlencoded POST or GET request body
   *
   * @summary Batch Update Group Profiles
   */
  groupBatchUpdate(body, metadata) {
    return this.core.fetch('/groups#group-batch-update', 'post', body, metadata);
  }
  /**
   * Deletes a group profile from Mixpanel.
   *
   * @summary Delete Group
   */
  deleteGroup(body, metadata) {
    return this.core.fetch('/groups#group-delete', 'post', body, metadata);
  }
  /**
   * Get a list of Lookup Tables defined in the project.
   *
   * @summary List Lookup Tables
   */
  listLookupTables(metadata) {
    return this.core.fetch('/lookup-tables', 'get', metadata);
  }
  /**
   * Replace the contents of an existing Lookup Table.
   * ***
   * [block:api-header]
   * {
   *   "title": "Validation"
   * }
   * [/block]
   * * The first column of the lookup table is assumed to be the ID of the row. All ID values
   * must be unique.
   * * The first row of the lookup table is a header row. The values in the header must be
   * unique, as each one uniquely identifies a column of the table. These will appear as
   * properties of the lookup table in Mixpanel's UI.
   * * The CSV must be valid according to RFC4180.
   * * If the `Content-Encoding: gzip` header is supplied, the table will be decompressed
   * before parsing.
   * [block:api-header]
   * {
   *   "title": "Types"
   * }
   * [/block]
   * * Integers or floats will be parsed as numbers.
   * * RFC3339 timestamps (`2021-08-21T05:36:01Z`) will parsed as datetimes.
   * * `true` or `false` (case-insensitive) will be parsed as boolean.
   * * Empty fields (two adjacent commas) will be treated as `undefined`
   * * Comma separated, quoted strings in square brackets
   * (`"[""Free"",""Paid"",""Enterprise""]"`) will be parsed as list of strings.
   * * All other values will be treated as strings.
   *
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code":
   * "id,artist,genre,is_platinum,name,num_listens,release_date,is_top_40,countries\nc994bb,Drake,Pop,True,Hotline
   * Bling,1700000000,2015-10-18T22:00:00,true,[]\nd8d949,Gipsy
   * Kings,Flamenco,False,Bamboleo,1170000,1987-07-12T05:00:00,false,\"[\"\"US\"\",\"\"CA\"\"]\"\na43fb8,Daft
   * Punk,House,False,Aerodynamic,41000000,2001-03-12T07:30:00,false,\"[\"\"IN\"\"]\"\n",
   *       "language": "text",
   *       "name": "sample.csv"
   *     }
   *   ]
   * }
   * [/block]
   *
   * [block:api-header]
   * {
   *   "title": "Errors"
   * }
   * [/block]
   * Lookup Tables are replaced in their entirety or not replaced at all. When the Lookup
   * Table fails to meet the above validation, we return an error that looks as follows:
   * [block:code]
   * {
   *   "codes": [
   *     {
   *       "code": "{\n  \"error\": \"some data points in the request failed validation\",\n
   * \"failed_records\": [\n    {\n      \"index\": 2,\n      \"message\": \"invalid row: row
   * indexes 1 and 2 have the same primary key\"\n    },\n    {\n      \"index\": 3,\n
   * \"message\": \"invalid row: wrong number of fields\"\n    }\n  ],\n  \"status\": 0\n}",
   *       "language": "json"
   *     }
   *   ]
   * }
   * [/block]
   * We will return at most the first 10 rows that failed validation.
   * [block:api-header]
   * {
   *   "title": "Limits"
   * }
   * [/block]
   * This endpoint will return a 429 error if called more than 100 times in a rolling 24 hour
   * window. We recommend updating lookup tables at most hourly to stay within this limit.
   *
   * This endpoint will return a 413 error if a Lookup Table exceeds 100MB uncompressed. In
   * practice, this translates to 1-2M rows. If you have a lookup table that exceeds the
   * limit, we recommend pruning the number of columns to those that are useful to analysis.
   * Removing long URLs or user-generated content can bring a lookup table within this limit.
   * If you still exceed the limit, please reach out to us at apis@mixpanel.com -- we'd love
   * to hear your use case!
   * [block:api-header]
   * {
   *   "title": "Legacy API"
   * }
   * [/block]
   * Our [legacy lookup tables
   * API](https://developer.mixpanel.com/v2.60/reference/lookup-tables) is now deprecated; we
   * strongly recommend transitioning to this API.
   *
   * @summary Replace a Lookup Table
   */
  replaceLookupTable(body, metadata) {
    return this.core.fetch('/lookup-tables/{id}', 'put', body, metadata);
  }
}
const createSDK = (() => {
  return new SDK();
})();
export default createSDK;
