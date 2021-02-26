import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Record";
import React from "react";
import styled from "styled-components";
import { SelectedIntentItem } from "./SelectedIntentItem";
import { Intent, IntentId } from "./wizard.types";

const EmptyStateWrapper = styled.div`
  margin: auto;
  text-align: center;
  width: 200px;
`;

const EmptyState = () => (
  <EmptyStateWrapper>
    <Typography variant="body2" gutterBottom>
      Add intents from the Pretrained Intents list to get started.
    </Typography>
  </EmptyStateWrapper>
);

const useStyles = makeStyles({
  paper: {
    width: "440px",
    marginRight: "40px",
    display: "flex",
    flexFlow: "column",
    overflow: "auto",
    padding: "16px",
  },
  list: { overflow: "auto" },
});

type Props = {
  selectedItemsById: Record<IntentId, Intent>;
  onRemoveItem: (id: IntentId) => void;
  onFocusItem: (id: IntentId) => void;
  focusedItemId: O.Option<IntentId>;
};

export const SelectedIntentsCard = (props: Props) => {
  const classes = useStyles();

  const hasSelectedItems = pipe(props.selectedItemsById, R.keys, A.isNonEmpty);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" gutterBottom>
        Selected Intents
      </Typography>
      {hasSelectedItems ? (
        <List className={classes.list}>
          {pipe(
            props.selectedItemsById,
            R.toArray,
            A.map(([k, v]) => {
              const isFocused = pipe(
                props.focusedItemId,
                O.map((sId) => sId === k),
                O.getOrElse<boolean>(() => false)
              );

              return (
                <SelectedIntentItem
                  key={k}
                  intent={v}
                  onRemoveItem={props.onRemoveItem}
                  onFocusItem={props.onFocusItem}
                  isFocused={isFocused}
                />
              );
            })
          )}
        </List>
      ) : (
        <EmptyState />
      )}
    </Paper>
  );
};
