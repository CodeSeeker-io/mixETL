import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type DeleteGroupBodyParam = FromSchema<typeof schemas.DeleteGroup.body>;
export type DeleteGroupMetadataParam = FromSchema<typeof schemas.DeleteGroup.metadata>;
export type DeleteGroupResponse200 = FromSchema<typeof schemas.DeleteGroup.response['200']>;
export type DeleteGroupResponse401 = FromSchema<typeof schemas.DeleteGroup.response['401']>;
export type DeleteGroupResponse403 = FromSchema<typeof schemas.DeleteGroup.response['403']>;
export type DeleteProfileBodyParam = FromSchema<typeof schemas.DeleteProfile.body>;
export type DeleteProfileMetadataParam = FromSchema<typeof schemas.DeleteProfile.metadata>;
export type DeleteProfileResponse200 = FromSchema<typeof schemas.DeleteProfile.response['200']>;
export type DeleteProfileResponse401 = FromSchema<typeof schemas.DeleteProfile.response['401']>;
export type DeleteProfileResponse403 = FromSchema<typeof schemas.DeleteProfile.response['403']>;
export type GroupBatchUpdateBodyParam = FromSchema<typeof schemas.GroupBatchUpdate.body>;
export type GroupBatchUpdateMetadataParam = FromSchema<typeof schemas.GroupBatchUpdate.metadata>;
export type GroupBatchUpdateResponse200 = FromSchema<
  typeof schemas.GroupBatchUpdate.response['200']
>;
export type GroupBatchUpdateResponse401 = FromSchema<
  typeof schemas.GroupBatchUpdate.response['401']
>;
export type GroupBatchUpdateResponse403 = FromSchema<
  typeof schemas.GroupBatchUpdate.response['403']
>;
export type GroupDeletePropertyBodyParam = FromSchema<typeof schemas.GroupDeleteProperty.body>;
export type GroupDeletePropertyMetadataParam = FromSchema<
  typeof schemas.GroupDeleteProperty.metadata
>;
export type GroupDeletePropertyResponse200 = FromSchema<
  typeof schemas.GroupDeleteProperty.response['200']
>;
export type GroupDeletePropertyResponse401 = FromSchema<
  typeof schemas.GroupDeleteProperty.response['401']
>;
export type GroupDeletePropertyResponse403 = FromSchema<
  typeof schemas.GroupDeleteProperty.response['403']
>;
export type GroupRemoveFromListPropertyBodyParam = FromSchema<
  typeof schemas.GroupRemoveFromListProperty.body
>;
export type GroupRemoveFromListPropertyMetadataParam = FromSchema<
  typeof schemas.GroupRemoveFromListProperty.metadata
>;
export type GroupRemoveFromListPropertyResponse200 = FromSchema<
  typeof schemas.GroupRemoveFromListProperty.response['200']
>;
export type GroupRemoveFromListPropertyResponse401 = FromSchema<
  typeof schemas.GroupRemoveFromListProperty.response['401']
>;
export type GroupRemoveFromListPropertyResponse403 = FromSchema<
  typeof schemas.GroupRemoveFromListProperty.response['403']
>;
export type GroupSetPropertyBodyParam = FromSchema<typeof schemas.GroupSetProperty.body>;
export type GroupSetPropertyMetadataParam = FromSchema<typeof schemas.GroupSetProperty.metadata>;
export type GroupSetPropertyOnceBodyParam = FromSchema<typeof schemas.GroupSetPropertyOnce.body>;
export type GroupSetPropertyOnceMetadataParam = FromSchema<
  typeof schemas.GroupSetPropertyOnce.metadata
>;
export type GroupSetPropertyOnceResponse200 = FromSchema<
  typeof schemas.GroupSetPropertyOnce.response['200']
>;
export type GroupSetPropertyOnceResponse401 = FromSchema<
  typeof schemas.GroupSetPropertyOnce.response['401']
>;
export type GroupSetPropertyOnceResponse403 = FromSchema<
  typeof schemas.GroupSetPropertyOnce.response['403']
>;
export type GroupSetPropertyResponse200 = FromSchema<
  typeof schemas.GroupSetProperty.response['200']
>;
export type GroupSetPropertyResponse401 = FromSchema<
  typeof schemas.GroupSetProperty.response['401']
>;
export type GroupSetPropertyResponse403 = FromSchema<
  typeof schemas.GroupSetProperty.response['403']
>;
export type GroupUnionBodyParam = FromSchema<typeof schemas.GroupUnion.body>;
export type GroupUnionMetadataParam = FromSchema<typeof schemas.GroupUnion.metadata>;
export type GroupUnionResponse200 = FromSchema<typeof schemas.GroupUnion.response['200']>;
export type GroupUnionResponse401 = FromSchema<typeof schemas.GroupUnion.response['401']>;
export type GroupUnionResponse403 = FromSchema<typeof schemas.GroupUnion.response['403']>;
export type ImportEventsBodyParam = FromSchema<typeof schemas.ImportEvents.body>;
export type ImportEventsMetadataParam = FromSchema<typeof schemas.ImportEvents.metadata>;
export type ImportEventsResponse200 = FromSchema<typeof schemas.ImportEvents.response['200']>;
export type ImportEventsResponse400 = FromSchema<typeof schemas.ImportEvents.response['400']>;
export type ImportEventsResponse401 = FromSchema<typeof schemas.ImportEvents.response['401']>;
export type ImportEventsResponse413 = FromSchema<typeof schemas.ImportEvents.response['413']>;
export type ImportEventsResponse429 = FromSchema<typeof schemas.ImportEvents.response['429']>;
export type ListLookupTablesMetadataParam = FromSchema<typeof schemas.ListLookupTables.metadata>;
export type ListLookupTablesResponse200 = FromSchema<
  typeof schemas.ListLookupTables.response['200']
>;
export type ListLookupTablesResponse401 = FromSchema<
  typeof schemas.ListLookupTables.response['401']
>;
export type ProfileAppendToListPropertyBodyParam = FromSchema<
  typeof schemas.ProfileAppendToListProperty.body
>;
export type ProfileAppendToListPropertyMetadataParam = FromSchema<
  typeof schemas.ProfileAppendToListProperty.metadata
>;
export type ProfileAppendToListPropertyResponse200 = FromSchema<
  typeof schemas.ProfileAppendToListProperty.response['200']
>;
export type ProfileAppendToListPropertyResponse401 = FromSchema<
  typeof schemas.ProfileAppendToListProperty.response['401']
>;
export type ProfileAppendToListPropertyResponse403 = FromSchema<
  typeof schemas.ProfileAppendToListProperty.response['403']
>;
export type ProfileBatchUpdateBodyParam = FromSchema<typeof schemas.ProfileBatchUpdate.body>;
export type ProfileBatchUpdateMetadataParam = FromSchema<
  typeof schemas.ProfileBatchUpdate.metadata
>;
export type ProfileBatchUpdateResponse200 = FromSchema<
  typeof schemas.ProfileBatchUpdate.response['200']
>;
export type ProfileBatchUpdateResponse401 = FromSchema<
  typeof schemas.ProfileBatchUpdate.response['401']
>;
export type ProfileBatchUpdateResponse403 = FromSchema<
  typeof schemas.ProfileBatchUpdate.response['403']
>;
export type ProfileDeletePropertyBodyParam = FromSchema<typeof schemas.ProfileDeleteProperty.body>;
export type ProfileDeletePropertyMetadataParam = FromSchema<
  typeof schemas.ProfileDeleteProperty.metadata
>;
export type ProfileDeletePropertyResponse200 = FromSchema<
  typeof schemas.ProfileDeleteProperty.response['200']
>;
export type ProfileDeletePropertyResponse401 = FromSchema<
  typeof schemas.ProfileDeleteProperty.response['401']
>;
export type ProfileDeletePropertyResponse403 = FromSchema<
  typeof schemas.ProfileDeleteProperty.response['403']
>;
export type ProfileNumericalAddBodyParam = FromSchema<typeof schemas.ProfileNumericalAdd.body>;
export type ProfileNumericalAddMetadataParam = FromSchema<
  typeof schemas.ProfileNumericalAdd.metadata
>;
export type ProfileNumericalAddResponse200 = FromSchema<
  typeof schemas.ProfileNumericalAdd.response['200']
>;
export type ProfileNumericalAddResponse401 = FromSchema<
  typeof schemas.ProfileNumericalAdd.response['401']
>;
export type ProfileNumericalAddResponse403 = FromSchema<
  typeof schemas.ProfileNumericalAdd.response['403']
>;
export type ProfileRemoveFromListPropertyBodyParam = FromSchema<
  typeof schemas.ProfileRemoveFromListProperty.body
>;
export type ProfileRemoveFromListPropertyMetadataParam = FromSchema<
  typeof schemas.ProfileRemoveFromListProperty.metadata
>;
export type ProfileRemoveFromListPropertyResponse200 = FromSchema<
  typeof schemas.ProfileRemoveFromListProperty.response['200']
>;
export type ProfileRemoveFromListPropertyResponse401 = FromSchema<
  typeof schemas.ProfileRemoveFromListProperty.response['401']
>;
export type ProfileRemoveFromListPropertyResponse403 = FromSchema<
  typeof schemas.ProfileRemoveFromListProperty.response['403']
>;
export type ProfileSetBodyParam = FromSchema<typeof schemas.ProfileSet.body>;
export type ProfileSetMetadataParam = FromSchema<typeof schemas.ProfileSet.metadata>;
export type ProfileSetPropertyOnceBodyParam = FromSchema<
  typeof schemas.ProfileSetPropertyOnce.body
>;
export type ProfileSetPropertyOnceMetadataParam = FromSchema<
  typeof schemas.ProfileSetPropertyOnce.metadata
>;
export type ProfileSetPropertyOnceResponse200 = FromSchema<
  typeof schemas.ProfileSetPropertyOnce.response['200']
>;
export type ProfileSetPropertyOnceResponse401 = FromSchema<
  typeof schemas.ProfileSetPropertyOnce.response['401']
>;
export type ProfileSetPropertyOnceResponse403 = FromSchema<
  typeof schemas.ProfileSetPropertyOnce.response['403']
>;
export type ProfileSetResponse200 = FromSchema<typeof schemas.ProfileSet.response['200']>;
export type ProfileSetResponse401 = FromSchema<typeof schemas.ProfileSet.response['401']>;
export type ProfileSetResponse403 = FromSchema<typeof schemas.ProfileSet.response['403']>;
export type ReplaceLookupTableBodyParam = FromSchema<typeof schemas.ReplaceLookupTable.body>;
export type ReplaceLookupTableMetadataParam = FromSchema<
  typeof schemas.ReplaceLookupTable.metadata
>;
export type ReplaceLookupTableResponse200 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['200']
>;
export type ReplaceLookupTableResponse400 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['400']
>;
export type ReplaceLookupTableResponse401 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['401']
>;
export type ReplaceLookupTableResponse404 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['404']
>;
export type ReplaceLookupTableResponse413 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['413']
>;
export type ReplaceLookupTableResponse429 = FromSchema<
  typeof schemas.ReplaceLookupTable.response['429']
>;
export type TrackEventBodyParam = FromSchema<typeof schemas.TrackEvent.body>;
export type TrackEventMetadataParam = FromSchema<typeof schemas.TrackEvent.metadata>;
export type TrackEventResponse200 = FromSchema<typeof schemas.TrackEvent.response['200']>;
export type TrackEventResponse401 = FromSchema<typeof schemas.TrackEvent.response['401']>;
export type TrackEventResponse403 = FromSchema<typeof schemas.TrackEvent.response['403']>;
export type UserProfileUnionBodyParam = FromSchema<typeof schemas.UserProfileUnion.body>;
export type UserProfileUnionMetadataParam = FromSchema<typeof schemas.UserProfileUnion.metadata>;
export type UserProfileUnionResponse200 = FromSchema<
  typeof schemas.UserProfileUnion.response['200']
>;
export type UserProfileUnionResponse401 = FromSchema<
  typeof schemas.UserProfileUnion.response['401']
>;
export type UserProfileUnionResponse403 = FromSchema<
  typeof schemas.UserProfileUnion.response['403']
>;
