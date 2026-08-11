export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold text-lg text-gray-900 ${className}`}>
      <span className="inline-flex h-6 w-6 overflow-hidden rounded-md shadow-sm" aria-hidden>
        <span className="w-1/3 bg-brand-green-600" />
        <span className="w-1/3 bg-brand-yellow-500" />
        <span className="w-1/3 bg-brand-red-500" />
      </span>
      MobiBenin
    </span>
  );
}
