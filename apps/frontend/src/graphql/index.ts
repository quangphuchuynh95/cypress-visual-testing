import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { graphqlFetcher } from './fetcher.ts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any };
};

export type Branch = {
  __typename?: 'Branch';
  branchScreenshots: Array<BranchScreenshot>;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type BranchScreenshot = {
  __typename?: 'BranchScreenshot';
  createdAt: Scalars['Timestamp']['output'];
  diffFileKey?: Maybe<Scalars['String']['output']>;
  diffMessage: Scalars['String']['output'];
  diffPixels?: Maybe<Scalars['Int']['output']>;
  diffStatus: DiffStatus;
  fileKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  screenshot: Screenshot;
  updatedAt: Scalars['Timestamp']['output'];
};

export enum DiffStatus {
  ExactlyTheSame = 'ExactlyTheSame',
  FileReadingError = 'FileReadingError',
  MissingOriginFile = 'MissingOriginFile',
  NotTheSame = 'NotTheSame',
}

export type Mutation = {
  __typename?: 'Mutation';
  approveBranchScreenshot?: Maybe<BranchScreenshot>;
};

export type MutationApproveBranchScreenshotArgs = {
  branchName: Scalars['String']['input'];
  message: Scalars['String']['input'];
  screenshotName: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  branch: Branch;
  branches: Array<Branch>;
  screenshot?: Maybe<Screenshot>;
};

export type QueryBranchArgs = {
  branchName: Scalars['String']['input'];
};

export type QueryScreenshotArgs = {
  name: Scalars['String']['input'];
};

export type Screenshot = {
  __typename?: 'Screenshot';
  createdAt: Scalars['Timestamp']['output'];
  fileKey?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  versions: Array<ScreenshotVersion>;
};

export type ScreenshotVersion = {
  __typename?: 'ScreenshotVersion';
  createdAt: Scalars['Timestamp']['output'];
  fileKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type AllBranchesQueryVariables = Exact<{ [key: string]: never }>;

export type AllBranchesQuery = {
  __typename?: 'Query';
  branches: Array<{
    __typename?: 'Branch';
    id: number;
    name: string;
    createdAt: any;
    updatedAt: any;
  }>;
};

export type BranchScreenshotsQueryVariables = Exact<{
  branch: Scalars['String']['input'];
}>;

export type BranchScreenshotsQuery = {
  __typename?: 'Query';
  branch: {
    __typename?: 'Branch';
    branchScreenshots: Array<{
      __typename?: 'BranchScreenshot';
      id: number;
      fileKey: string;
      diffFileKey?: string | null;
      diffPixels?: number | null;
      diffMessage: string;
      diffStatus: DiffStatus;
      screenshot: {
        __typename?: 'Screenshot';
        name: string;
        fileKey?: string | null;
      };
    }>;
  };
};

export type ApproveBranchScreenshotMutationVariables = Exact<{
  branch: Scalars['String']['input'];
  screenshot: Scalars['String']['input'];
  message: Scalars['String']['input'];
}>;

export type ApproveBranchScreenshotMutation = {
  __typename?: 'Mutation';
  approveBranchScreenshot?: {
    __typename?: 'BranchScreenshot';
    id: number;
  } | null;
};

export const AllBranchesDocument = `
    query AllBranches {
  branches {
    id
    name
    createdAt
    updatedAt
  }
}
    `;
export const useAllBranchesQuery = <TData = AllBranchesQuery, TError = unknown>(
  variables?: AllBranchesQueryVariables,
  options?: UseQueryOptions<AllBranchesQuery, TError, TData>,
) =>
  useQuery<AllBranchesQuery, TError, TData>(
    variables === undefined ? ['AllBranches'] : ['AllBranches', variables],
    graphqlFetcher<AllBranchesQuery, AllBranchesQueryVariables>(
      AllBranchesDocument,
      variables,
    ),
    options,
  );

useAllBranchesQuery.getKey = (variables?: AllBranchesQueryVariables) =>
  variables === undefined ? ['AllBranches'] : ['AllBranches', variables];
export const BranchScreenshotsDocument = `
    query BranchScreenshots($branch: String!) {
  branch(branchName: $branch) {
    branchScreenshots {
      id
      fileKey
      diffFileKey
      diffPixels
      diffMessage
      diffStatus
      screenshot {
        name
        fileKey
      }
    }
  }
}
    `;
export const useBranchScreenshotsQuery = <
  TData = BranchScreenshotsQuery,
  TError = unknown,
>(
  variables: BranchScreenshotsQueryVariables,
  options?: UseQueryOptions<BranchScreenshotsQuery, TError, TData>,
) =>
  useQuery<BranchScreenshotsQuery, TError, TData>(
    ['BranchScreenshots', variables],
    graphqlFetcher<BranchScreenshotsQuery, BranchScreenshotsQueryVariables>(
      BranchScreenshotsDocument,
      variables,
    ),
    options,
  );

useBranchScreenshotsQuery.getKey = (
  variables: BranchScreenshotsQueryVariables,
) => ['BranchScreenshots', variables];
export const ApproveBranchScreenshotDocument = `
    mutation ApproveBranchScreenshot($branch: String!, $screenshot: String!, $message: String!) {
  approveBranchScreenshot(
    branchName: $branch
    screenshotName: $screenshot
    message: $message
  ) {
    id
  }
}
    `;
export const useApproveBranchScreenshotMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    ApproveBranchScreenshotMutation,
    TError,
    ApproveBranchScreenshotMutationVariables,
    TContext
  >,
) =>
  useMutation<
    ApproveBranchScreenshotMutation,
    TError,
    ApproveBranchScreenshotMutationVariables,
    TContext
  >(
    ['ApproveBranchScreenshot'],
    (variables?: ApproveBranchScreenshotMutationVariables) =>
      graphqlFetcher<
        ApproveBranchScreenshotMutation,
        ApproveBranchScreenshotMutationVariables
      >(ApproveBranchScreenshotDocument, variables)(),
    options,
  );
useApproveBranchScreenshotMutation.getKey = () => ['ApproveBranchScreenshot'];
