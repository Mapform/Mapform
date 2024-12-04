export function Usage() {
  return (
    <div className="flex flex-col pb-12">
      <div className="@4xl:grid-cols-3 grid grid-cols-1 gap-x-8">
        <div className="pb-8">
          <h2 className="text-md font-semibold">Basic</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            While in Alpha Mapflow only supports basic-tier features.
          </p>
        </div>
        <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
          Some usage stuff
        </div>
      </div>
    </div>
  );
}
