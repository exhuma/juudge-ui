export type ContextInfo = {
  metadata: {
    name: string;
    type: string;
    identifiers: unknown;
  };
  raw_content: string;
};
export type QueryResponse = {
  question: string;
  answer: string;
  contexts: ContextInfo[];
};
