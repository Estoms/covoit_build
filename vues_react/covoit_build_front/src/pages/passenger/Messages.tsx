import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function PassengerMessages() {
  const conversations = [
    {
      name: "Kossi",
      lastMessage: "Je suis déjà à la gare routière.",
      time: "Il y a 5 min",
    },
    {
      name: "Awa",
      lastMessage: "Départ confirmé à 9h 👍",
      time: "Hier",
    },
  ];

  return (
    <PageShell
      title="Messages"
      subtitle="Communique avec les conducteurs de tes trajets."
      actions={[
        { label: "Retour dashboard", href: "/p", variant: "secondary" },
      ]}
      nextApi={["GET /messages/conversations", "GET /messages/thread/{id}", "POST /messages/send"]}
    >
      <Section title="Conversations récentes">
        <div className="grid gap-3">
          {conversations.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border bg-white p-4 hover:shadow-sm transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">{c.time}</div>
              </div>
              <div className="mt-1 text-sm text-gray-600">{c.lastMessage}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
