"use client";

import { Search } from "../search";
import { Header } from "../header";
import { Table } from "./table";

export function TableView() {
  return (
    <div className="overflow-auto p-12">
      <Search />
      <Header />
      <Table />
    </div>
  );
}
