import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useAuthorize } from "./utils/hooks";

export default function Command() {
  const authenticated = useAuthorize();
  return <List></List>;
}
