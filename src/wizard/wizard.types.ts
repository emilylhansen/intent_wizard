export type IntentId = string;

export type Expression = {
  id: string;
  text: string;
};

export type Intent = {
  id: IntentId;
  name: string;
  description: string;
  trainingData: {
    expressionCount: number;
    expressions: Array<Expression>;
  };
  reply: {
    id: string;
    text: string;
  };
};

export type ServerBlob = Array<Intent>;
