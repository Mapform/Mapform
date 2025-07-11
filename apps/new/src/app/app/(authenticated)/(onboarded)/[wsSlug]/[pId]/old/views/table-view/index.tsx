"use client";

import { Search, SearchInput, SearchList } from "../../search";
import { Header } from "../../header";
import { Table } from "./table";

export function TableView() {
  return (
    <div className="overflow-auto p-12">
      <Search>
        <SearchInput />
        <SearchList />
      </Search>
      <Header />
      <Table />
    </div>
  );
}
