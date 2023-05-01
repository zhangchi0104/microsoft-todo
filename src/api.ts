import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { curry } from "lodash";
import { TodoTaskList } from "@microsoft/microsoft-graph-types";
interface QueryOptions {
  select?: string[];
  expand?: string[];
  filter?: string;
  top?: number;
  skip?: number;
  orderby?: string;
}
axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const err = error as AxiosError;
    console.error(err.response?.data);
  }
);
function opts2query(opts: QueryOptions) {
  const query = new URLSearchParams();
  if (opts.select) {
    query.append("$select", opts.select.join(","));
  }
  if (opts.expand) {
    query.append("$expand", opts.expand.join(","));
  }
  if (opts.filter) {
    query.append("$filter", opts.filter);
  }
  if (opts.top) {
    query.append("$top", opts.top.toString());
  }
  if (opts.skip) {
    query.append("$skip", opts.skip.toString());
  }
  if (opts.orderby) {
    query.append("$orderby", opts.orderby);
  }
  return query;
}

export async function fetchMyLists(token: string, query: QueryOptions = { top: 10 }) {
  const url = `https://graph.microsoft.com/v1.0/me/todo/lists`;
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: opts2query(query),
  };
  const { data } = await axios.get(url, options);
  console.log("fetchMyLists: " + JSON.stringify(data));
  return data.value as TodoTaskList[];
}
