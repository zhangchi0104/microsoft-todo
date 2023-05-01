import "react";
import { fetchMyLists } from "./api";
import { useState, useEffect } from "react";
import { useAuthorize } from "./utils/hooks";
import { TodoTaskList } from "@microsoft/microsoft-graph-types";
import { List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
const useMyLists = () => {
  const [myLists, setMyLists] = useCachedState<TodoTaskList[]>("myLists", []);
  const token = useAuthorize();
  useEffect(() => {
    if (!token) {
      return;
    }

    fetchMyLists(token).then((myLists) => setMyLists(myLists));
  }, [token]);
  return myLists;
};
export default function MyLists() {
  const lists = useMyLists();
  const renderList = (list: TodoTaskList) => <List.Item key={list.id} title={list.displayName!} />;

  return <List isLoading={!!lists && lists.length === 0}>{lists!.map(renderList)}</List>;
}
