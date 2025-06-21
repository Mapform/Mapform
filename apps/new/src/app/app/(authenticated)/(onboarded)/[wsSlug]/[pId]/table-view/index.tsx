"use client";

import { Header } from "../header";
import { Table } from "./table";

export function TableView() {
  return (
    <div className="overflow-auto p-12">
      <Header />
      <Table />
    </div>
  );
}
