import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Close from "@material-ui/icons/Close";
import React from "react";
import styled from "styled-components";
import { Intent, IntentId } from "./wizard.types";

const SelectedIntentItemWrapper = styled.div<{ isFocused: boolean }>`
  border-bottom: 1px solid #e8e8e8;

  :hover {
    background: #e8e8e8;
  }
`;

type Props = {
  onRemoveItem: (id: IntentId) => void;
  intent: Intent;
  onFocusItem: (id: IntentId) => void;
  isFocused: boolean;
};

export const SelectedIntentItem = (props: Props) => (
  <SelectedIntentItemWrapper
    isFocused={props.isFocused}
    onClick={() => props.onFocusItem(props.intent.id)}
  >
    <ListItem key={props.intent.id}>
      <ListItemText primary={props.intent.name} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            props.onRemoveItem(props.intent.id);
          }}
          size="small"
        >
          <Close />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  </SelectedIntentItemWrapper>
);
