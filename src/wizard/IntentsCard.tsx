import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Record";
import React from "react";
import { IntentItem } from "./IntentItem";
import { Intent, IntentId } from "./wizard.types";

//#region hooks start
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

const useIntentsCard = (props: Props) => {
  const [openItemId, setOpenItemId] = React.useState<O.Option<IntentId>>(
    O.none
  );

  const classes = useStyles();

  const onOpenItem = (id: IntentId) => setOpenItemId(O.some(id));

  const onCloseItem = () => setOpenItemId(O.none);

  return {
    openItemId,
    classes,
    onOpenItem,
    onCloseItem,
  };
};
//#endregion hooks end

type Props = {
  intents: Array<Intent>;
  selectedItemsById: Record<IntentId, Intent>;
  onRemoveItem: (id: IntentId) => void;
  onAddItem: (intent: Intent) => void;
  focusedItemId: O.Option<IntentId>;
};

export const IntentsCard = (props: Props) => {
  const state = useIntentsCard(props);

  return (
    <Paper elevation={3} className={state.classes.paper}>
      <Typography variant="h6" gutterBottom>
        Pretrained Intents
      </Typography>
      <List className={state.classes.list}>
        {pipe(
          props.intents,
          A.map((i) => {
            const isChecked = pipe(
              props.selectedItemsById,
              R.lookup(i.id),
              O.isSome
            );
            const isOpen = pipe(
              state.openItemId,
              O.map((oId) => oId === i.id),
              O.getOrElse(() => false)
            );
            const isFocused = pipe(
              props.focusedItemId,
              O.map((sId) => sId === i.id),
              O.getOrElse<boolean>(() => false)
            );

            const onChangeCheck = () => {
              isChecked ? props.onRemoveItem(i.id) : props.onAddItem(i);
            };
            const onOpen = () =>
              isOpen ? state.onCloseItem() : state.onOpenItem(i.id);

            return (
              <IntentItem
                key={i.id}
                intent={i}
                isChecked={isChecked}
                onChangeCheck={onChangeCheck}
                isOpen={isOpen}
                onOpen={onOpen}
                isFocused={isFocused}
              />
            );
          })
        )}
      </List>
    </Paper>
  );
};
