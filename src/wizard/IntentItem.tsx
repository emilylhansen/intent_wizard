import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Android from "@material-ui/icons/Android";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Face from "@material-ui/icons/Face";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import React from "react";
import styled from "styled-components";
import { Expression, Intent } from "./wizard.types";

//#region styles/components start
const IntentItemWrapper = styled.div`
  border-bottom: 1px solid #e8e8e8;

  .MuiCollapse-container {
    .MuiCollapse-entered {
      height: 300px !important;
      overflow: hidden !important;
    }
  }
`;

const ResponseWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ExpressionItem = ({ expression }: { expression: Expression }) => (
  <ListItem
    key={expression.id}
    dense
    style={{
      paddingLeft: "2px",
      borderBottom: "1px solid #e8e8e8",
    }}
  >
    <Typography variant="caption" display="block">
      {`"${expression.text}"`}
    </Typography>
  </ListItem>
);

const UserExpressionItem = ({ text }: { text: string }) => (
  <ResponseWrapper>
    <Face fontSize="small" style={{ marginRight: "8px" }} />
    <Typography variant="caption" display="block">
      {text}
    </Typography>
  </ResponseWrapper>
);

const AiReplyItem = ({ text }: { text: string }) => (
  <ResponseWrapper>
    <Android fontSize="small" style={{ marginRight: "8px" }} />
    <Typography variant="caption" display="block">
      {text}
    </Typography>
  </ResponseWrapper>
);
//#endregion styles/components end

//#region hooks start
const useStyles = makeStyles({
  list: {
    overflow: "auto",
    height: "200px",
    marginTop: "8px",
    backgroundColor: "#fff",
  },
  collapse: { padding: "0 16px 16px 56px" },
});

const useIntentItem = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const classes = useStyles();

  React.useEffect(() => {
    if (props.isFocused && ref.current !== null) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.isFocused, ref.current]);

  const givenExpressionsCount = props.intent.trainingData.expressions.length;
  const missingExpressionsCount =
    props.intent.trainingData.expressionCount - givenExpressionsCount;

  return { ref, classes, givenExpressionsCount, missingExpressionsCount };
};
//#endregion hooks end

type Props = {
  isChecked: boolean;
  onChangeCheck: () => void;
  intent: Intent;
  isOpen: boolean;
  onOpen: () => void;
  isFocused: boolean;
};

export const IntentItem = (props: Props) => {
  const state = useIntentItem(props);

  return (
    <IntentItemWrapper ref={state.ref}>
      <ListItem>
        <Checkbox checked={props.isChecked} onChange={props.onChangeCheck} />
        <div>
          <ListItemText
            primary={props.intent.name}
            secondary={props.intent.description}
          />
          {!props.isOpen &&
            pipe(
              props.intent.trainingData.expressions,
              A.head,
              O.map((h) => <UserExpressionItem text={`"${h.text}"`} />),
              O.toNullable
            )}
        </div>
        <ListItemSecondaryAction>
          <IconButton onClick={props.onOpen} size="small">
            {props.isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse
        in={props.isOpen}
        timeout="auto"
        unmountOnExit
        className={state.classes.collapse}
      >
        <AiReplyItem text={`"${props.intent.reply.text}"`} />
        <UserExpressionItem
          text={props.intent.trainingData.expressionCount.toLocaleString()}
        />

        <List component="div" disablePadding className={state.classes.list}>
          {pipe(
            props.intent.trainingData.expressions,
            A.map((e) => <ExpressionItem key={e.id} expression={e} />)
          )}
          {pipe(
            A.range(state.givenExpressionsCount, state.missingExpressionsCount),
            A.map((i) => (
              <ExpressionItem
                key={i}
                expression={{
                  id: i.toLocaleString(),
                  text: "Potato",
                }}
              />
            ))
          )}
        </List>
      </Collapse>
    </IntentItemWrapper>
  );
};
