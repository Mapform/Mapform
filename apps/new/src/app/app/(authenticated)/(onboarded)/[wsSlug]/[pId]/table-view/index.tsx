"use client";

import { Header } from "../header";
import { Table } from "./table";

export function TableView() {
  return (
    <div className="overflow-auto p-8">
      <Header />
      <Table />
    </div>
  );
}
