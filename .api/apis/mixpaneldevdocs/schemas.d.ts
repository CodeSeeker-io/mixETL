declare const DeleteGroup: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with $token, $group_key, and $group_id values and a $delete key.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$set'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $delete: {
          readonly type: 'string';
          readonly default: 'null';
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const DeleteProfile: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, $ignore_alias and a $delete operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$delete'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $delete: {
          readonly type: 'string';
          readonly default: 'null';
        };
        readonly $ignore_alias: {
          readonly type: 'boolean';
          readonly default: false;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupBatchUpdate: {
  readonly body: {
    readonly type: 'string';
    readonly format: 'blob';
    readonly description: 'A JSON list of update objects, each with a $token, $group_key, $group_id, and an operation.';
    readonly default: '[\n    {\n        "$token": "YOUR_PROJECT_TOKEN",\n        "$group_key": "Company",\n        "$group_id": "Mixpanel",\n        "$set": {\n            "Address": "1313 Mockingbird Lane"\n        }\n    },\n    {\n        "$token": "YOUR_PROJECT_TOKEN",\n        "$group_key": "Company",\n        "$group_id": "Wayne Enterprises",\n        "$set_once": {\n            "Address": "Wayne Tower, Gotham City"\n        }\n    }\n]\n';
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupDeleteProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $group_key, $group_id, and $unset operation list.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$unset'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $unset: {
          readonly type: 'array';
          readonly minItems: 1;
          readonly description: 'Profile properties to be removed.';
          readonly items: {
            readonly type: 'string';
          };
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupRemoveFromListProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $group_key, $group_id, and $remove operation object.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$remove'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $remove: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupSetProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $group_key, $group_id, and $set operation object.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$set'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $set: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupSetPropertyOnce: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $group_key, $group_id, and $set_once operation object.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$set_once'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $set_once: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const GroupUnion: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $group_key, $group_id, and a union operation object.';
      readonly required: readonly ['$token', '$group_key', '$group_id', '$unset'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $group_key: {
          readonly type: 'string';
          readonly default: 'Company';
        };
        readonly $group_id: {
          readonly type: 'string';
          readonly default: 'Mixpanel';
        };
        readonly $union: {
          readonly type: 'object';
          readonly minProperties: 1;
          readonly additionalProperties: {
            readonly type: 'array';
            readonly minItems: 1;
            readonly items: {
              readonly oneOf: readonly [
                {
                  readonly type: 'number';
                },
                {
                  readonly type: 'string';
                }
              ];
            };
          };
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ImportEvents: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly required: readonly ['event', 'properties'];
      readonly properties: {
        readonly event: {
          readonly type: 'string';
          readonly title: 'event';
          readonly description: 'The name of the event.';
        };
        readonly properties: {
          readonly type: 'object';
          readonly title: 'properties';
          readonly description: 'A JSON object containing properties of the event.';
          readonly required: readonly ['time', '$insert_id', 'distinct_id'];
          readonly properties: {
            readonly time: {
              readonly type: 'integer';
              readonly title: 'time';
              readonly description: 'The time at which the event occurred, in seconds or milliseconds since UTC epoch.';
            };
            readonly distinct_id: {
              readonly type: 'string';
              readonly title: 'distinct_id';
              readonly description: 'The unique identifier of the user who performed the event.';
            };
            readonly $insert_id: {
              readonly type: 'string';
              readonly title: '$insert_id';
              readonly description: 'A unique identifier for the event, used for deduplication. Events with identical values for (event, time, distinct_id, $insert_id) are considered duplicates; only the latest ingested one will be considered in queries.';
            };
          };
          readonly additionalProperties: true;
        };
      };
      readonly additionalProperties: false;
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly strict: {
            readonly type: 'string';
            readonly default: '1';
            readonly enum: readonly ['0', '1'];
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'When set to 1 (recommended), Mixpanel will validate the batch and return errors per event that failed.';
          };
          readonly project_id: {
            readonly default: '<YOUR_PROJECT_ID>';
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'The Mixpanel project_id, used to authenticate service account credentials.';
          };
        };
        readonly required: readonly ['strict', 'project_id'];
      },
      {
        readonly type: 'object';
        readonly properties: {
          readonly 'Content-Type': {
            readonly type: 'string';
            readonly default: 'application/json';
            readonly enum: readonly ['application/json', 'application/x-ndjson'];
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
          };
          readonly 'Content-Encoding': {
            readonly type: 'string';
            readonly enum: readonly ['gzip'];
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [200];
        };
        readonly num_records_imported: {
          readonly type: 'integer';
          readonly examples: readonly [2000];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['OK'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '400': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [400];
        };
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Bad Request'];
        };
        readonly num_records_imported: {
          readonly type: 'integer';
          readonly examples: readonly [999];
        };
        readonly failed_records: {
          readonly type: 'array';
          readonly items: {
            readonly type: 'object';
            readonly properties: {
              readonly index: {
                readonly type: 'number';
              };
              readonly insert_id: {
                readonly type: 'string';
                readonly examples: readonly ['13c0b661-f48b-51cd-ba54-97c5999169c0'];
              };
              readonly field: {
                readonly type: 'string';
                readonly examples: readonly ['properties.time'];
              };
              readonly message: {
                readonly type: 'string';
                readonly examples: readonly [
                  "'properties.time' is invalid: must be specified as seconds since epoch"
                ];
              };
            };
          };
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [401];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['Invalid credentials'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Unauthorized'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '413': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [413];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['request exceeds max limit of 2097152 bytes'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Request Entity Too Large'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '429': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [429];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly [
            'Project exceeded rate limits. Please retry the request with exponential backoff.'
          ];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Too Many Requests'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ListLookupTables: {
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly project_id: {
            readonly default: '<YOUR_PROJECT_ID>';
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'The Mixpanel project_id, used to authenticate service account credentials.';
          };
        };
        readonly required: readonly ['project_id'];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'number';
          readonly examples: readonly [200];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['OK'];
        };
        readonly results: {
          readonly type: 'array';
          readonly items: {
            readonly type: 'object';
            readonly properties: {
              readonly id: {
                readonly type: 'string';
                readonly format: 'uuid';
                readonly examples: readonly ['55b4fb2b-e8de-466c-930f-8b36640b9b5e'];
              };
              readonly name: {
                readonly type: 'string';
                readonly examples: readonly ['Accounts'];
              };
            };
          };
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [401];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['Invalid credentials'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Unauthorized'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileAppendToListProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $append operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$append'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $append: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileBatchUpdate: {
  readonly body: {
    readonly type: 'string';
    readonly format: 'blob';
    readonly description: 'A JSON list of update objects, each with a $token, $distinct_id, and an operation.';
    readonly default: '[\n    {\n        "$token": "YOUR_PROJECT_TOKEN",\n        "$distinct_id": "13793",\n        "$add": { "Coins Gathered": 12 }\n    },\n    {\n        "$token": "YOUR_PROJECT_TOKEN",\n        "$distinct_id": "13794",\n        "$add": { "Coins Gathered": 13 }\n    }\n]\n';
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileDeleteProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $unset operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$unset'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $unset: {
          readonly type: 'array';
          readonly minItems: 1;
          readonly description: 'Profile properties to be removed.';
          readonly items: {
            readonly type: 'string';
          };
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileNumericalAdd: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $add operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$add'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $add: {
          readonly type: 'object';
          readonly additionalProperties: {
            readonly type: 'number';
          };
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileRemoveFromListProperty: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $remove operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$remove'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $remove: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileSet: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $set operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$set'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $set: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ProfileSetPropertyOnce: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and $set_once operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$set_once'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $set_once: {
          readonly type: 'object';
          readonly additionalProperties: true;
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const ReplaceLookupTable: {
  readonly body: {
    readonly type: 'string';
    readonly format: 'blob';
    readonly default: 'id,field1,field2\nkey1,v1,z1\nkey2,z1,z2\n';
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly id: {
            readonly default: 'LOOKUP_TABLE_ID';
            readonly type: 'string';
            readonly format: 'uuid';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'The ID of the lookup table to replace.';
          };
        };
        readonly required: readonly ['id'];
      },
      {
        readonly type: 'object';
        readonly properties: {
          readonly project_id: {
            readonly default: '<YOUR_PROJECT_ID>';
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'The Mixpanel project_id, used to authenticate service account credentials.';
          };
        };
        readonly required: readonly ['project_id'];
      },
      {
        readonly type: 'object';
        readonly properties: {
          readonly 'Content-Type': {
            readonly type: 'string';
            readonly default: 'text/csv';
            readonly enum: readonly ['text/csv'];
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [200];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['OK'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '400': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [400];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['Some data points in the request failed validation.'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Bad Request'];
        };
        readonly failed_records: {
          readonly type: 'array';
          readonly items: {
            readonly type: 'object';
            readonly properties: {
              readonly index: {
                readonly type: 'number';
                readonly examples: readonly [2];
              };
              readonly message: {
                readonly type: 'string';
                readonly examples: readonly ['primary key is required and cannot be blank'];
              };
            };
          };
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [401];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['Invalid credentials'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Unauthorized'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '404': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [200];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly [
            "Lookup table with id 'f077cb07-008a-4955-8a4a-b4c163db3a87' was not found."
          ];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Not Found'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '413': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [413];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly ['request exceeds max limit of 2097152 bytes'];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Request Entity Too Large'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '429': {
      readonly type: 'object';
      readonly properties: {
        readonly code: {
          readonly type: 'integer';
          readonly examples: readonly [429];
        };
        readonly error: {
          readonly type: 'string';
          readonly examples: readonly [
            'Project exceeded rate limits. Please retry the request with exponential backoff.'
          ];
        };
        readonly status: {
          readonly type: 'string';
          readonly examples: readonly ['Too Many Requests'];
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const TrackEvent: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly required: readonly ['event', 'properties'];
      readonly properties: {
        readonly event: {
          readonly type: 'string';
          readonly title: 'event';
          readonly description: 'The name of the event.';
        };
        readonly properties: {
          readonly type: 'object';
          readonly title: 'properties';
          readonly description: 'A JSON object containing properties of the event.';
          readonly properties: {
            readonly token: {
              readonly type: 'string';
              readonly title: 'token';
              readonly description: 'Project token.';
            };
            readonly time: {
              readonly type: 'integer';
              readonly title: 'time';
              readonly description: 'The time at which the event occurred, in seconds or milliseconds since UTC epoch.';
            };
            readonly distinct_id: {
              readonly type: 'string';
              readonly title: 'distinct_id';
              readonly description: 'The unique identifier of the user who performed the event.';
            };
            readonly $insert_id: {
              readonly type: 'string';
              readonly title: '$insert_id';
              readonly description: 'A unique identifier for the event, used for deduplication. Events with identical values for (event, time, distinct_id, $insert_id) are considered duplicates; only the latest ingested one will be considered in queries.';
            };
          };
          readonly additionalProperties: true;
        };
      };
      readonly additionalProperties: false;
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly ip: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present and equal to 1, Mixpanel will use the ip address of the incoming request and compute a distinct_id using a hash function if no distinct_id is provided. This is different from providing a `properties.ip` value in the Event Object.';
          };
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly img: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present and equal to 1, Mixpanel will serve a 1x1 transparent pixel image as a response to the request. This is useful for adding [Pixel Tracking](https://en.wikipedia.org/wiki/Web_beacon) in places that javascript is not supported.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
declare const UserProfileUnion: {
  readonly body: {
    readonly type: 'array';
    readonly minItems: 1;
    readonly items: {
      readonly type: 'object';
      readonly description: 'A JSON update object, with a $token, $distinct_id, and a $union operation object.';
      readonly required: readonly ['$token', '$distinct_id', '$union'];
      readonly properties: {
        readonly $token: {
          readonly type: 'string';
          readonly default: 'YOUR_PROJECT_TOKEN';
        };
        readonly $distinct_id: {
          readonly type: 'string';
          readonly default: '13793';
        };
        readonly $union: {
          readonly type: 'object';
          readonly minProperties: 1;
          readonly additionalProperties: {
            readonly type: 'array';
            readonly minItems: 1;
            readonly items: {
              readonly oneOf: readonly [
                {
                  readonly type: 'number';
                },
                {
                  readonly type: 'string';
                }
              ];
            };
          };
        };
      };
    };
    readonly $schema: 'http://json-schema.org/draft-04/schema#';
  };
  readonly metadata: {
    readonly allOf: readonly [
      {
        readonly type: 'object';
        readonly properties: {
          readonly verbose: {
            readonly type: 'integer';
            readonly minimum: 0;
            readonly maximum: 1;
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: "If present and equal to 1, Mixpanel will respond with a JSON Object describing the success or failure of the tracking call. The returned object will have two keys: `status`, with the value 1 on success and 0 on failure, and `error`, with a string-valued error message if the request wasn't successful. This is useful for debugging during implementation.";
          };
          readonly redirect: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will serve a redirect to the given url as a response to the request. This is useful to add link tracking in notifications.';
          };
          readonly callback: {
            readonly type: 'string';
            readonly $schema: 'http://json-schema.org/draft-04/schema#';
            readonly description: 'If present, Mixpanel will return a `content-type: text/javascript` with a body that calls a function by value provided. This is useful for creating local callbacks to a successful track call in JavaScript.';
          };
        };
        readonly required: readonly [];
      }
    ];
  };
  readonly response: {
    readonly '200': {
      readonly type: 'integer';
      readonly enum: readonly [1, 0];
      readonly description: '`1`';
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '401': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
    readonly '403': {
      readonly type: 'object';
      readonly properties: {
        readonly error: {
          readonly type: 'string';
        };
        readonly status: {
          readonly type: 'string';
          readonly enum: readonly ['error'];
          readonly description: '`error`';
        };
      };
      readonly $schema: 'http://json-schema.org/draft-04/schema#';
    };
  };
};
export {
  DeleteGroup,
  DeleteProfile,
  GroupBatchUpdate,
  GroupDeleteProperty,
  GroupRemoveFromListProperty,
  GroupSetProperty,
  GroupSetPropertyOnce,
  GroupUnion,
  ImportEvents,
  ListLookupTables,
  ProfileAppendToListProperty,
  ProfileBatchUpdate,
  ProfileDeleteProperty,
  ProfileNumericalAdd,
  ProfileRemoveFromListProperty,
  ProfileSet,
  ProfileSetPropertyOnce,
  ReplaceLookupTable,
  TrackEvent,
  UserProfileUnion,
};
