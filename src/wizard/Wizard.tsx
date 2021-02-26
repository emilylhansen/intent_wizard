import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import React from "react";
import styled from "styled-components";
import { IntentsCard } from "./IntentsCard";
import { Intent, IntentId, ServerBlob } from "./wizard.types";
import { SelectedIntentsCard } from "./SelectedIntentsCard";
const intents = require("./intents.json");

//#region styles start
const WizardWrapper = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
`;

const Header = styled.div`
  padding: 24px;
`;

const HeaderDescription = styled.div`
  width: 50%;
`;

const IntentsCards = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 24px;
  background: #e8e8e8;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
`;
//#endregion styles end

//#region hooks start
const useWizard = () => {
  const [selectedItemsById, setSelectedItemsById] = React.useState<
    Record<IntentId, Intent>
  >(R.empty);
  const [focusedItemId, setFocusedItemId] = React.useState<O.Option<IntentId>>(
    O.none
  );

  const onAddItem = (intent: Intent) => {
    pipe(
      selectedItemsById,
      R.insertAt(intent.id, intent),
      setSelectedItemsById
    );
  };

  const onRemoveItem = (id: IntentId) => {
    pipe(selectedItemsById, R.deleteAt(id), setSelectedItemsById);
    setFocusedItemId(O.none);
  };

  const onSelectItem = (id: IntentId) => setFocusedItemId(O.some(id));

  return {
    selectedItemsById,
    onAddItem,
    onRemoveItem,
    onSelectItem,
    focusedItemId,
  };
};
//#endregion hooks end

export const Wizard = () => {
  const state = useWizard();

  return (
    <WizardWrapper>
      <Header>
        <Typography variant="h5">1. Intents</Typography>
        <HeaderDescription>
          <Typography variant="body2" style={{ marginBottom: "8px" }}>
            Select your intents. You can select from the pretrained intents or
            create your own.
          </Typography>
          <Typography variant="caption">
            In order to understand what the user wants, our AI is trained to
            recognize different intents. For each intent the AI gets a list of
            user messages (we call them expressions) as training data to learn
            how users express that intent. For every intent there will also be a
            reply that the AI Bot should give, once it recognizes that intent.
          </Typography>
        </HeaderDescription>
      </Header>
      <IntentsCards>
        <IntentsCard
          intents={(intents as unknown) as ServerBlob}
          selectedItemsById={state.selectedItemsById}
          onAddItem={state.onAddItem}
          onRemoveItem={state.onRemoveItem}
          focusedItemId={state.focusedItemId}
        />
        <SelectedIntentsCard
          selectedItemsById={state.selectedItemsById}
          onRemoveItem={state.onRemoveItem}
          onSelectItem={state.onSelectItem}
          focusedItemId={state.focusedItemId}
        />
      </IntentsCards>
      <Footer>
        <Button
          variant="outlined"
          color="primary"
          style={{ marginRight: "8px" }}
          size="small"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            console.log({ selectedItemsById: state.selectedItemsById })
          }
        >
          Create/Save
        </Button>
      </Footer>
    </WizardWrapper>
  );
};
