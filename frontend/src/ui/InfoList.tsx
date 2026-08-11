
export default function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}
